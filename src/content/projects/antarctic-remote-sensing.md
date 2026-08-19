---
title: "Project SIREN"
blurb: "Autonomous Antarctic ice buoy that logs raw 6-DoF IMU and GPS data to SD card at 71Hz for post-processing on land."
period: "Mar – Jun 2026"
order: 2
featured: false
role: "I designed and implemented the sensing subsystem of an autonomous ice buoy for deployment in the Antarctic Marginal Ice Zone"
domain: embedded
stack:
  - "STM32F401CE (Black Pill)"
  - "LSM9DS1 IMU"
  - "u-blox NEO-6M GPS"
  - "Arduino / STM32duino"
  - "C++"
  - "Python"
  - "KiCad"
keyResult: "7 of 9 ATPs passed — raw IMU data logged at 71Hz with zero data loss over a 15-minute endurance test"
hero: ../../assets/projects/antarctic-remote-sensing/hero.jpg
heroAlt: "SIREN sensor stack on a workshop bench — hand-wired sensor boards on a black platform surrounded by test leads, with a laptop beside them"
heroFocus: "center 62%"
---

## PROBLEM

The Antarctic Marginal Ice Zone is critically under-monitored. Existing autonomous buoys such as the UCT SHARC V3.0 process sensor data onboard and discard the high-frequency content that captures floe-floe collision events and wave signatures — the exact data climate researchers need. Manned expeditions are infrequent and expensive, and satellite data retrieval costs make large-scale autonomous deployment economically unviable. The project was initiated through UCT D-School design sessions with client Ms. Robyn Verrinder of the UCT Department of Electrical Engineering.

## CONSTRAINTS

- **Power:** All sensing components must operate within a 3.3V, 150mA peak rail supplied by the power subsystem
- **Sample rate:** Minimum 1Hz above Nyquist for 0.5Hz MIZ wave frequencies — requiring at least 1Hz IMU sampling in practice 100Hz was targeted
- **Data integrity:** Zero onboard processing — all raw samples must reach the SD card uncorrupted
- **Environment:** Hardware must be rated to −40°C for Antarctic deployment
- **Interface:** A 13-byte beacon packet must be delivered to the communications subsystem every 15 minutes over UART
- **Budget:** Total sensing BOM under R600
- **Timeline:** Full hardware validation within one semester

## WHAT I BUILT

A hand-wired sensing node on an STM32F401CE Black Pill microcontroller interfacing three peripherals: an LSM9DS1 9-DoF IMU over I2C, a u-blox NEO-6M GPS receiver over UART, and a MicroSD card module over SPI. Firmware written in C++ using STM32duino implements a 500-sample RAM buffer flushed to a CSV file every 7 seconds, a high-pass filter (α=0.995) on the vertical acceleration axis to remove gravity DC offset, non-blocking GPS NMEA parsing, and a request-driven UART beacon interface to the ESP32 communications subsystem. A KiCad schematic documents the intended SPI deployment design. Nine acceptance test procedures were designed and executed to validate each functional requirement.

## RESULT

- Sample rate: 71Hz achieved via I2C (100Hz SPI target — STM32duino library incompatibility prevented SPI integration)
- 42,600 rows logged over 10 minutes with zero null or corrupted fields
- High-pass filtered vertical acceleration resolved wave-frequency excitation at 1.05Hz with 17.7dB SNR above noise floor
- Tap detection: 12.0 m/s² peak — 10.6× above the 2× RMS baseline threshold
- GPS: 59.9 fixes per minute, 22.3m position error under urban multipath (hardware confirmed correct, HDOP=1.6)
- Active current draw: 65–75mA steady-state, ~100mA peak — within the 150mA budget
- Beacon packet: 13 bytes, correct format, delivered on request to ESP32 over UART at 115200 baud
- 7 of 9 ATPs passed

## WHAT I'D DO DIFFERENTLY

SPI for the IMU should be implemented using the STM32 HAL directly rather than through the STM32duino abstraction layer, which has known compatibility issues with the Adafruit LSM9DS1 driver. This would achieve the 100Hz target and reduce per-sample bus time from ~350μs to ~15μs. I would also select the u-blox NEO-M9N over the NEO-6M from the start — its GPS, GLONASS, and BeiDou multi-constellation support is not a performance upgrade for Antarctic deployment, it is a functional requirement, since GPS-only receivers degrade significantly at high southern latitudes due to the 55-degree orbital inclination limit of GPS satellites. Finally I would implement duty cycling firmware before the first ATP run rather than treating it as future work, as it directly affects the deployment duration claim.