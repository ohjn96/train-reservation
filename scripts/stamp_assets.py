#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""docs/ 의 js 주소에 판올림 번호를 찍는다.

GitHub Pages 는 자산에 max-age=600 을 붙인다. HTML 만 새로 받고 js 는 캐시된
옛것을 쓰는 10분짜리 창이 생기는데, 그 사이 id 나 함수 이름이 바뀌었으면
페이지가 깨진다. 주소에 ?v= 를 달아 아예 다른 URL 로 만들면 그 창이 없어진다.

docs/ 의 js 를 고쳤으면 커밋 전에 실행:

    python scripts/stamp_assets.py            # 내용이 바뀌었으면 번호를 올린다
    python scripts/stamp_assets.py --check    # 어긋나 있으면 실패 (CI 용)
"""
from __future__ import annotations

import argparse
import hashlib
import re
import sys
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / 'docs'
JS_DIR = DOCS / 'assets' / 'js'

# <script src="assets/js/x.js?v=..."> 와 import ... from './x.js?v=...'
SRC_RE = re.compile(r'(src="assets/js/[\w.-]+\.js)(\?v=[\w]+)?(")')
IMPORT_RE = re.compile(r"(from '\./[\w.-]+\.js)(\?v=[\w]+)?(')")


def fingerprint() -> str:
    """js 내용 전체의 짧은 해시. 내용이 같으면 번호도 같다."""
    digest = hashlib.sha256()
    for path in sorted(JS_DIR.glob('*.js')):
        digest.update(path.name.encode())
        digest.update(re.sub(rb"\?v=\w+", b"", path.read_bytes()))
    return digest.hexdigest()[:8]


def stamp(text: str, version: str) -> str:
    text = SRC_RE.sub(rf'\1?v={version}\3', text)
    return IMPORT_RE.sub(rf"\1?v={version}\3", text)


def main() -> int:
    parser = argparse.ArgumentParser(description='js 주소에 판올림 번호 찍기')
    parser.add_argument('--check', action='store_true', help='고치지 않고 확인만')
    args = parser.parse_args()

    version = fingerprint()
    targets = sorted(DOCS.glob('*.html')) + sorted(JS_DIR.glob('*.js'))
    stale = []

    for path in targets:
        before = path.read_text(encoding='utf-8')
        after = stamp(before, version)
        if before == after:
            continue
        stale.append(path.relative_to(DOCS))
        if not args.check:
            path.write_text(after, encoding='utf-8')

    if args.check:
        if stale:
            print(f'판올림 번호가 어긋납니다 ({version}): '
                  + ', '.join(str(p) for p in stale), file=sys.stderr)
            print('python scripts/stamp_assets.py 를 실행하고 커밋하세요.', file=sys.stderr)
            return 1
        print(f'판올림 번호 일치: {version}')
        return 0

    print(f'판올림 번호 {version} · 고친 파일 {len(stale)}개')
    return 0


if __name__ == '__main__':
    sys.exit(main())
