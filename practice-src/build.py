import sys, pathlib
src = pathlib.Path(__file__).parent
eng = (src / "engine.html").read_text(encoding="utf-8")
for data, out, title, sub, bid in [
    ("advprog-data.js", "AdvProg-practice.html", "Advanced Programming: Practice", "Quiz, flashcards and cheat sheet for every chapter of the CS2 AdvProg notes", "advprog"),
    ("mips-data.js", "MIPS-practice.html", "MIPS2C (MIPS part): Practice", "Quiz, flashcards and cheat sheet for the MIPS chapters of MIPS2C", "mips"),
]:
    p = src / data
    if not p.exists():
        continue
    html = eng.replace("__TITLE__", title).replace("__SUBTITLE__", sub).replace("__BANKID__", bid).replace("/*DATA*/", p.read_text(encoding="utf-8"))
    (src.parent / out).write_text(html, encoding="utf-8")
    print("built", out)
