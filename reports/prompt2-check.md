# Debrief prompt 2 check

Prompt 2 claims each firm would have been worth more if every platform had held FEED 2. For each run, the final valuation of every firm is compared with the COUNTERFACTUAL per-firm value (FEED 2, SAFEGUARDS 15, no cards, no codes; same seed and incident draws). 200 seeds per cell; transparency off; no audits; the game length is fixed per column (the live game ends at a hidden quarter from 10 to 14). "Observed human" draws firm trajectories from the four live FRONTIER sessions in `tools/calibration/observed-human.json`.

Each cell: share of sessions in which **every** firm finished below the per-firm counterfactual value · share of sessions in which the industry total did · share of all firms below.

| Field | N | 10 quarters | 12 quarters | 14 quarters |
|---|---|---|---|---|
| observed human | 6 | 97.5% · 100.0% · 99.5% | 99.0% · 100.0% · 99.8% | 99.0% · 100.0% · 99.8% |
| observed human | 10 | 97.0% · 100.0% · 99.7% | 99.0% · 100.0% · 99.9% | 100.0% · 100.0% · 100.0% |
| observed human | 20 | 98.5% · 100.0% · 99.9% | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% |
| observed human | 40 | 99.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% |
| mixed bots | 6 | 0.0% · 100.0% · 77.8% | 0.5% · 100.0% · 80.5% | 2.0% · 100.0% · 82.4% |
| mixed bots | 10 | 0.0% · 100.0% · 80.8% | 2.5% · 100.0% · 82.3% | 21.0% · 100.0% · 86.8% |
| mixed bots | 20 | 41.0% · 100.0% · 95.7% | 94.0% · 100.0% · 99.7% | 100.0% · 100.0% · 100.0% |
| mixed bots | 40 | 26.5% · 100.0% · 96.3% | 94.5% · 100.0% · 99.9% | 100.0% · 100.0% · 100.0% |
| half greedy | 6 | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% |
| half greedy | 10 | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% |
| half greedy | 20 | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% |
| half greedy | 40 | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% |
| all greedy | 6 | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% |
| all greedy | 10 | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% |
| all greedy | 20 | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% |
| all greedy | 40 | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% | 100.0% · 100.0% · 100.0% |
| **all cells** | | 78.7% · 100.0% · 98.1% | 86.8% · 100.0% · 99.0% | 88.9% · 100.0% · 99.2% |
