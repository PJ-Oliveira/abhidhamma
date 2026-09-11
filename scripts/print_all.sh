#!/bin/bash
jq '.[] | select(.id == 18) | .pt' data/works/abhidhamma-in-daily-life/texto__0.json
jq '.[] | select(.id == 704) | .pt' data/works/abhidhamma-in-daily-life/texto__0.json
jq '.[] | select(.id == 298) | .pt' data/works/buddhism-in-daily-life/texto__17.json
jq '.[] | select(.id == 21) | .pt' data/works/path-without-ownership/texto.json
jq '.[] | select(.id == 119) | .pt' data/works/path-without-ownership/texto.json
jq '.[] | select(.id == 579) | .pt' data/works/path-without-ownership/texto.json
jq '.[] | select(.id == 630) | .pt' data/works/path-without-ownership/texto.json
jq '.[] | select(.id == 28) | .pt' data/works/the-buddhist-teaching-on-physical-phenomena/texto.json
jq '.[] | select(.id == 37) | .pt' data/works/the-conditionality-of-life/texto__0.json
jq '.[] | select(.id == 20) | .pt' data/works/visuddhimagga/mula__2.json
jq '.[] | select(.id == 1484) | .pt' data/works/visuddhimagga/mula__3.json
jq '.[] | select(.id == 16) | .pt' data/works/visuddhimagga/tika__1.json
