---
title: "Chest X-ray Pneumonia Classifier"
blurb: "A CNN built from scratch beat a fine-tuned ResNet18. The ablations showed why the regularisation was hurting."
period: "May 2026"
order: 6
featured: true
role: "Solo project for HUB4049F. Built both models, designed the ablation study, and interpreted the results."
domain: ml
stack:
  - "Python"
  - "PyTorch"
  - "torchvision"
  - "PneumoniaMNIST (MedMNIST v2)"
  - "CNN (3 conv blocks, ~84k params)"
  - "ResNet18 (ImageNet, frozen backbone)"
keyResult: "AUC 0.920 at 83.0% accuracy, beating a fine-tuned ResNet18 (AUC 0.875)"
hero: ../../assets/projects/chestxray/hero.jpg
heroAlt: "Chest radiograph from the PneumoniaMNIST dataset, showing the lung fields used as model input"
---

## PROBLEM

The chest radiograph is the first-line investigation for pneumonia: cheap, fast, and available almost everywhere. Reading one is the hard part. Consolidation, air bronchograms and interstitial infiltrates overlap with plenty of benign findings, and inter-rater agreement between radiologists is only moderate. Where there is a radiologist shortage, films get read by non-specialists or not read promptly at all.

The goal was not a deployable model. It was a working end-to-end pipeline, and an honest account of where it falls short.

## CONSTRAINTS

- PneumoniaMNIST: 5,856 single-channel images at 28×28, downsampled from radiographs originally around 1024×1024.
- Training split is 74.2% positive. A model that always predicts pneumonia scores 62.5% on test, so accuracy alone is close to meaningless; sensitivity, specificity and AUC carry the result.
- The official MedMNIST split is patient-stratified, which avoids the same patient appearing in both train and test. That leakage can inflate accuracy by tens of percentage points.
- CPU training throughout, which caps how far ResNet18 could reasonably be fine-tuned.

## WHAT I BUILT

Two models trained head to head, then an ablation study on the regularisation.

**Simple CNN.** Three convolutional blocks (Conv3×3 → ReLU → MaxPool2) at widths 1 → 16 → 32 → 64, then a 128-unit fully connected layer with dropout and a single-logit output. Around 84,000 parameters, small enough to train comfortably on CPU. `BCEWithLogitsLoss` rather than a manual sigmoid plus BCE, for numerical stability.

**ResNet18 baseline.** ImageNet pretrained weights, with `conv1` replaced by a single-channel 7×7 convolution initialised by averaging the pretrained RGB weights across the colour axis. That preserves the learned edge filters instead of discarding them. Everything frozen except `conv1` and the linear head.

**Augmentation, chosen for the imaging context.** Horizontal flips, because a chest is roughly left-right symmetric. Small rotations of ±10°, reflecting real patient positioning variation. Brightness and contrast jitter of ±15%, simulating differences in exposure and detector calibration between machines. Aggressive cropping was avoided deliberately, since pneumonia often presents as diffuse opacity across the full lung field and a tight crop risks removing the finding entirely.

**Ablation study.** Four variants of the simple CNN: the regularised baseline, then augmentation, dropout and weight decay removed in turn.

## RESULT

The simple CNN reached **AUC 0.920 at 83.0% accuracy**. The frozen ResNet18 reached **0.875 and 81.1%**.

| Model | Accuracy | Sensitivity | Specificity | AUC |
|---|---|---|---|---|
| Simple CNN (scratch) | 0.830 | 0.987 | 0.568 | 0.920 |
| ResNet18 (frozen) | 0.811 | 0.954 | 0.573 | 0.875 |

Sensitivity was strong for both. Specificity was not: 0.568 and 0.573, meaning nearly half of all normal X-rays were flagged as pneumonia. In a triage setting that error direction is arguably the right one (missing a pneumonia is worse than a false alarm), but 0.568 is low enough to be a practical problem.

**The ablations were the interesting part.** Removing dropout *improved* AUC to **0.950**. That is the wrong direction if a model is over-fitting. The explanation is that the baseline was under-fitting the minority class rather than over-fitting the majority: augmentation and dropout both make the training task harder, which on a 74%-positive dataset pushes the decision boundary further toward pneumonia. Sensitivity stayed near 1.0 across every variant; specificity was the only thing that moved.

A small CNN beating a pretrained ResNet is surprising until you look at the setup. ImageNet features were learned on three-channel natural images at 224×224; here ResNet18 sees greyscale medical images at 64×64 with roughly 3% of its parameters trainable. Filters tuned for fur and foliage transfer poorly to pulmonary opacities, and the frozen backbone has no opportunity to adapt. The simple CNN, with two orders of magnitude fewer parameters, can fit its features entirely to this one task.

## WHAT I'D DO DIFFERENTLY

Fix the class imbalance first. A class-weighted loss and an operating threshold selected from the validation ROC, rather than defaulting to 0.5, would address the specificity gap directly, and would probably make the regularisers useful again rather than harmful.

Then unfreeze ResNet18 entirely and train at 224×224, which I'd expect to reverse the comparison given GPU access.

The clearest gap is that I ran no saliency analysis. Without Grad-CAM or something like it, I can't say whether the model is attending to pulmonary opacities or to text annotations, scanner watermarks and tube placement. That's a real weakness in a medical imaging result, and it's the first thing I'd add.

The model is not deployable, and the report says so: single-centre paediatric data, one fixed split, no calibration, no external validation, no clinical workflow.