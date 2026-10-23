"""Render the actual synthetic analytical output, not a production screenshot."""
from pathlib import Path
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
quality = json.loads((ROOT / 'data/processed/quality_summary.json').read_text())
incidents = pd.read_csv(ROOT / 'data/processed/incidents.csv')
providers = pd.read_csv(ROOT / 'analysis/provider_analysis.csv')
fig = plt.figure(figsize=(13, 7.5), facecolor='#f6f8f9')
fig.text(.06, .94, 'CoreOps | analytics operacional', fontsize=24, weight='bold', color='#173631')
fig.text(.06, .88, 'Pipeline reproduzivel | dados sinteticos | instante de referencia fixo', fontsize=13, color='#52636b')
values = [quality['raw_events'], quality['incidents_built'], int(incidents.is_active.sum()), quality['duplicates_removed']]
for x, title, value in zip([.06, .30, .54, .78], ['Eventos de entrada', 'Incidentes', 'Ativos na amostra', 'Duplicidade removida'], values):
    fig.text(x, .79, title, fontsize=11, color='#52636b')
    fig.text(x, .71, str(value), fontsize=30, color='#147e57', weight='bold')
ax = fig.add_axes([.15, .19, .76, .40], facecolor='#f6f8f9')
providers = providers.sort_values('downtime_share_pct')
ax.barh(providers.operator, providers.downtime_share_pct, color=['#73828d', '#d39a29', '#008aab', '#147e57'])
ax.set_xlabel('Participacao na indisponibilidade acumulada (%)')
ax.set_title('Distribuicao por operadora ficticia', loc='left', pad=14)
ax.set_xlim(0, 55)
ax.spines[['top', 'right']].set_visible(False)
for i, value in enumerate(providers.downtime_share_pct): ax.text(value+.6, i, f'{value:.1f}%', va='center')
fig.text(.06, .06, 'Previa analitica Python. Nao representa volumes ou desempenho de uma operacao real.', fontsize=11, color='#52636b')
path = ROOT / 'docs/images/preview.png'
path.parent.mkdir(parents=True, exist_ok=True)
fig.savefig(path, dpi=140)
plt.close(fig)
