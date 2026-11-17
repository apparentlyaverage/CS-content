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

# CS201 exam-prep page: drills + papers into its own engine
ex = (src / "exam-engine.html").read_text(encoding="utf-8")
data = "\n".join((src / f).read_text(encoding="utf-8") for f in ["exam-drills-adv.js", "exam-drills-mips.js", "exam-papers.js"])
(src.parent / "CS201-exam-prep.html").write_text(ex.replace("/*DATA*/", data), encoding="utf-8")
print("built CS201-exam-prep.html")

# CS201 study plan (notes + questions)
pe = (src / "plan-engine.html").read_text(encoding="utf-8")
(src.parent / "CS201-study-plan.html").write_text(pe.replace("/*DATA*/", (src / "plan-data.js").read_text(encoding="utf-8")), encoding="utf-8")
print("built CS201-study-plan.html")
