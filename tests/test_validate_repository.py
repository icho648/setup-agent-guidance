import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


VALIDATOR = Path(__file__).parents[1] / ".github/scripts/validate_repository.py"
REPOSITORY = Path(__file__).parents[1]
PLUGIN_VALIDATOR = Path(
    os.environ.get(
        "PLUGIN_VALIDATOR",
        Path.home() / ".codex/skills/.system/plugin-creator/scripts/validate_plugin.py",
    )
)


class ValidateRepositoryTest(unittest.TestCase):
    def test_missing_localized_counterpart_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            skill = root / "plugins/example/skills/example"
            (skill / "references").mkdir(parents=True)
            (skill / "SKILL.md").write_text("Read references/guide.<locale>.md.\n")
            (skill / "references/guide.en.md").write_text("English\n")

            result = subprocess.run(
                [sys.executable, VALIDATOR, root],
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("missing localized counterpart", result.stderr)

    def test_unreferenced_localized_reference_requires_counterpart(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            skill = root / "plugins/example/skills/example"
            (skill / "references").mkdir(parents=True)
            (skill / "SKILL.md").write_text("No resource references.\n")
            (skill / "references/notes.en.md").write_text("English\n")

            result = subprocess.run(
                [sys.executable, VALIDATOR, root],
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("missing localized counterpart", result.stderr)

    def test_single_locale_exception_does_not_apply_to_other_skills(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            skill = root / "plugins/example/skills/example"
            (skill / "references").mkdir(parents=True)
            (skill / "SKILL.md").write_text("No resource references.\n")
            (skill / "references/triggers.zh-CN.md").write_text("中文\n")

            result = subprocess.run(
                [sys.executable, VALIDATOR, root],
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("missing localized counterpart", result.stderr)

    @unittest.skipUnless(PLUGIN_VALIDATOR.is_file(), "plugin-creator validator unavailable")
    def test_invalid_codex_manifest_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / "repository"
            shutil.copytree(REPOSITORY, root, ignore=shutil.ignore_patterns(".git"))
            manifest_path = root / "plugins/setup-agent-guidance/.codex-plugin/plugin.json"
            manifest = json.loads(manifest_path.read_text())
            manifest["unsupported"] = True
            manifest_path.write_text(json.dumps(manifest))

            result = subprocess.run(
                [
                    sys.executable,
                    PLUGIN_VALIDATOR,
                    root / "plugins/setup-agent-guidance",
                ],
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("unsupported", result.stdout + result.stderr)

    @unittest.skipUnless(PLUGIN_VALIDATOR.is_file(), "plugin-creator validator unavailable")
    def test_non_semver_plugin_version_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / "repository"
            shutil.copytree(REPOSITORY, root, ignore=shutil.ignore_patterns(".git"))
            manifest_path = root / "plugins/setup-agent-guidance/.codex-plugin/plugin.json"
            manifest = json.loads(manifest_path.read_text())
            manifest["version"] = "next"
            manifest_path.write_text(json.dumps(manifest))

            result = subprocess.run(
                [
                    sys.executable,
                    PLUGIN_VALIDATOR,
                    root / "plugins/setup-agent-guidance",
                ],
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("strict semver", result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
