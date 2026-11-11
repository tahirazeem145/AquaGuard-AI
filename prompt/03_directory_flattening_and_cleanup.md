# Prompt 03: Directory Flattening & Explorer Cleanup

* **Prompt ID:** PROMPT-03
* **Date & Timestamp:** 2026-10-31 23:36:18 IST
* **Phase:** Workspace Maintenance & Hygiene
* **Status:** Completed

---

## Verbatim User Prompt

```text
why there are two two files 
[Attached user image showing duplicate mrd and prd folder entries in VS Code file explorer with shortcut link arrows]
```

---

## Problem Diagnosis

* When initializing the workspace and linking files between an inner `AquaGuard-AI` subfolder and the root, Windows NTFS directory junctions (`<JUNCTION>`) were created.
* In the VS Code file explorer, NTFS junctions are rendered with a curved shortcut arrow icon on the folder glyph.
* VS Code displayed both the real directories inside the nested `AquaGuard-AI/` folder and the junction links at the root level, making it appear as though folders and files were duplicated.

---

## Action Taken & Deliverables Generated

1. Removed the NTFS directory junctions `mrd` and `prd` from the root.
2. Removed the inner `AquaGuard-AI` junction to `research` and the hardlink to `prompt.md`.
3. Moved the real directories `mrd/` and `prd/` directly to the project root `E:\project\AquaGuard AI\`.
4. Deleted the redundant inner `AquaGuard-AI/` directory.
5. Result: A completely flat, clean file explorer structure directly at the project root with zero duplicate entries and zero shortcut link icons:
   ```text
   AquaGuard AI/
   ├── mrd/
   │   └── mrd.md
   ├── prd/
   │   └── prd.md
   ├── research/
   │   └── [8 research markdown files]
   └── prompt.md
   ```
6. Updated `prompt.md` decision log with entry DEC-009.

