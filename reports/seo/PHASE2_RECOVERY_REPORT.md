# OBD2HQ Phase 2 Recovery Report

Generated: 2026-08-08T21:43:59.911Z

Canonical/domain/URL structure changes made: 0

URLs created: 0

URLs removed: 0

URLs noindexed: 0

## Before

Gold: 11,720

Silver: 6,460

Thin: 9,155

Raw Gold OBD: 376

Fallback OBD: 1,847

## After / Current Audit

Gold: 11720

Silver: 6460

Thin: 9155

Raw Gold OBD: 376

Fallback OBD: 1847

## Thin Page Distribution

- code_hub: 9145 (99.89%) - Runtime fallback supports the page, but raw code data is not gold-ready yet.
- other: 5 (0.05%) - Unclassified or low-signal page type.
- vehicle_spec: 5 (0.05%) - Vehicle spec URL has no matching local generated spec record.

Main finding: thin pages are overwhelmingly concentrated in the fallback code hub template, not spread evenly across the whole site.

## First 100 Fallback Upgrade Queue

The file `OBD_GOLD_UPGRADE_QUEUE.csv` contains the first 100 fallback codes ranked by RECOVERY_SCORE. These are not marked Gold yet; they are the priority work queue for verified raw DTC enrichment.

Top 10:

- P0110: score 100, system sensor_air_fuel_o2, impressions 51, clicks 0
- P0203: score 100, system injector_cylinder_fuel_control, impressions 46, clicks 1
- P0125: score 100, system sensor_air_fuel_o2, impressions 40, clicks 0
- P0234: score 100, system boost_turbo_fuel_pressure, impressions 40, clicks 2
- P0216: score 100, system injector_cylinder_fuel_control, impressions 39, clicks 1
- P0183: score 95, system sensor_air_fuel_o2, impressions 37, clicks 0
- P0135: score 95, system sensor_air_fuel_o2, impressions 29, clicks 0
- P0103: score 95, system sensor_air_fuel_o2, impressions 14, clicks 1
- P0251: score 94, system boost_turbo_fuel_pressure, impressions 28, clicks 0
- P0201: score 92, system injector_cylinder_fuel_control, impressions 24, clicks 0

## Information Gain Policy

Gold candidates must add code-specific detection logic, component context, diagnostic sequence, live-data/freeze-frame interpretation where applicable, electrical/mechanical test relevance, repair paths and FAQ. Code number, component name and vehicle name swaps are not sufficient.

## Cannibalization Findings

Potential cannibalization rows: 0

High risk rows: 0

Medium risk rows: 0

## GSC Recovery Targets

KEEP: 1

IMPROVE: 34

CONSOLIDATE: 0

REVIEW: 19

## Internal Links Added

0 in this phase. This pass intentionally produces the verified target map first. Internal links should be added only after each fallback code is upgraded to verified raw Gold.

## Required Next Step

Start with the first rows in `OBD_GOLD_UPGRADE_QUEUE.csv`. Upgrade raw code data only when the DTC-specific information gain test passes; otherwise keep the URL as a review candidate rather than creating fake Gold content.
