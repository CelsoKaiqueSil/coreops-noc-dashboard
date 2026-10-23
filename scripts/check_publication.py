"""Fail publication checks on obvious secrets, private IP literals and local config files.
This is a guardrail, not a complete secret audit or authorization to publish corporate code.
"""
from pathlib import Path
import re
import subprocess

root = Path(__file__).resolve().parents[1]
paths = subprocess.check_output(['git', 'ls-files', '--cached', '--others', '--exclude-standard'], cwd=root, text=True).splitlines()
patterns = [re.compile(r'gh[pousr]_[A-Za-z0-9]{30,}'), re.compile(r'AKIA[A-Z0-9]{16}'),
            re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
            re.compile(r'(?<![0-9])(?:10(?:\.[0-9]{1,3}){3}|192\.168(?:\.[0-9]{1,3}){2}|172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?![0-9])')]
for name in set(paths):
    path = root / name
    assert path.name not in {'.env', 'connection.env', 'credentials.json'}, 'Private config filename detected'
    if path.suffix.lower() in {'.png', '.jpg', '.jpeg', '.ico'} or not path.is_file():
        continue
    try:
        content = path.read_text(encoding='utf-8-sig')
    except (UnicodeDecodeError, OSError):
        continue
    for pattern in patterns:
        assert not pattern.search(content), f'Potential sensitive value in {name}; review locally'
print('Publication guard passed; human confidentiality review is still required')
