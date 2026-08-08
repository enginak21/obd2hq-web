# OBD2HQ Phase 2 Recovery Report

Generated: 2026-08-08T22:11:37.454Z

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

Gold: 11900

Silver: 6690

Thin: 8745

Raw Gold OBD: 476

Fallback OBD: 1747

## Thin Page Distribution

- code_hub: 8735 (99.89%) - Runtime fallback supports the page, but raw code data is not gold-ready yet.
- other: 5 (0.06%) - Unclassified or low-signal page type.
- vehicle_spec: 5 (0.06%) - Vehicle spec URL has no matching local generated spec record.

Main finding: thin pages are overwhelmingly concentrated in the fallback code hub template, not spread evenly across the whole site.

## First 100 Fallback Upgrade Queue

The file `OBD_GOLD_UPGRADE_QUEUE.csv` contains the first 100 fallback codes ranked by RECOVERY_SCORE. These are not marked Gold yet; they are the priority work queue for verified raw DTC enrichment.

Top 10:

- P0212: score 60, system injector_cylinder_fuel_control, impressions 0, clicks 0
- P0213: score 60, system injector_cylinder_fuel_control, impressions 0, clicks 0
- P0214: score 60, system injector_cylinder_fuel_control, impressions 0, clicks 0
- P0215: score 60, system injector_cylinder_fuel_control, impressions 0, clicks 0
- P0218: score 60, system injector_cylinder_fuel_control, impressions 0, clicks 0
- P0219: score 60, system injector_cylinder_fuel_control, impressions 0, clicks 0
- P0220: score 60, system injector_cylinder_fuel_control, impressions 0, clicks 0
- P0221: score 60, system injector_cylinder_fuel_control, impressions 0, clicks 0
- P0222: score 60, system injector_cylinder_fuel_control, impressions 0, clicks 0
- P0223: score 60, system injector_cylinder_fuel_control, impressions 0, clicks 0

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
