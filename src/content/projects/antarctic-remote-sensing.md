---
title: "Project SIREN"
blurb: "Autonomous Antarctic ice buoy that logs raw 6-DoF IMU and GPS data to SD card at 71Hz for post-processing on land."
period: "Mar – Jun 2026"
order: 2
featured: true
role: "Designed and implemented the sensing subsystem of an autonomous ice buoy for deployment in the Antarctic Marginal Ice Zone."
domain: embedded
stack:
  - "STM32F401CE (Black Pill)"
  - "LSM9DS1 IMU"
  - "u-blox NEO-6M GPS"
  - "Arduino / STM32duino"
  - "C++"
  - "Python"
  - "KiCad"
keyResult: "7 of 9 ATPs passed. Raw IMU data logged at 71Hz with zero loss over a 15-minute endurance test."
hero: ../../assets/projects/antarctic-remote-sensing/hero.jpg
heroAlt: "SIREN sensor stack on a workshop bench: hand-wired sensor boards on a black platform surrounded by test leads, with a laptop beside them"
heroFocus: "center 62%"
teamPhoto: ../../assets/projects/antarctic-remote-sensing/team.jpg
teamAlt: "The SIREN project team on the day of demo, standing together with the buoy"
teamCaption: "The SIREN team. Loved working with these three, and even better, they are my friends."
---

## PROBLEM

The Antarctic Marginal Ice Zone is under-monitored. Existing autonomous buoys such as UCT SHARC V3.0 process data onboard and discard the high-frequency content that captures floe collisions and wave signatures, which is exactly the data climate researchers need. The project, initiated with client Ms. Robyn Verrinder (UCT EE), targets a buoy that logs raw samples for post-processing on land.

## CONSTRAINTS

- Power: 3.3V, 150mA peak from the power subsystem.
- Sample rate: 100Hz targeted to cover 0.5Hz MIZ wave content.
- Data integrity: no onboard processing; raw samples reach the SD card intact.
- Environment: rated to -40°C.
- Interface: 13-byte beacon delivered to the comms subsystem every 15 minutes over UART.
- Budget: sensing BOM under R600, one semester timeline.

## WHAT I BUILT

A hand-wired STM32F401CE node reading an LSM9DS1 IMU over I2C, a NEO-6M GPS over UART, and a MicroSD card over SPI. Firmware (C++, STM32duino) uses a 500-sample RAM buffer flushed to CSV every 7 seconds, a high-pass filter (α=0.995) on vertical acceleration, non-blocking NMEA parsing, and a request-driven UART beacon to the ESP32 comms board. A KiCad schematic documents the intended SPI build. Nine ATPs validated each functional requirement.

## RESULT

- 71Hz sample rate via I2C (100Hz SPI target blocked by STM32duino driver incompatibility).
- 42,600 rows logged over 10 minutes with zero null or corrupted fields.
- Wave excitation resolved at 1.05Hz with 17.7dB SNR.
- Tap detection peak of 12.0 m/s², 10.6× above the 2× RMS threshold.
- GPS: 59.9 fixes per minute, 22.3m error under urban multipath (HDOP=1.6).
- Active current: 65 to 75mA steady, ~100mA peak, within the 150mA budget.
- Beacon: 13 bytes at 115200 baud, correct on request.
- 7 of 9 ATPs passed.

## WHAT I'D DO DIFFERENTLY

Drive the IMU over SPI using the STM32 HAL directly rather than the STM32duino Adafruit driver, which would hit the 100Hz target and drop per-sample bus time from ~350μs to ~15μs. Pick the u-blox NEO-M9N from the start: multi-constellation support is a functional requirement at high southern latitudes, not a nice-to-have. Implement duty cycling firmware before the first ATP run rather than treating it as future work.
