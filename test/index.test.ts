import { describe, expect, it } from "vitest";
import { diff_match_patch as DMP, Diff } from "diff-match-patch";
import { text } from "stream/consumers";

const input = `
  describe('should', () => {
    it('exported', () => {
      expect(one).toEqual(1)
    })
  })
`;

const output = `
  describe('should', () => {
    it('hi', () => {
      expect(two).toEqual(2)
      expect(one).toEqual(1)
    })
  })
`;

interface InsertPatch {
  type: "insert";
  from: number;
  text: string;
}

interface RemovalPatch {
  type: "removal";
  from: number;
  length: number;
}

type Patch = InsertPatch | RemovalPatch;

function diff(a: string, b: string): Diff[] {
  const differ = new DMP();
  const delta = differ.diff_main(a, b);
  differ.diff_cleanupSemantic(delta);
  return delta;
}

function calculatePath(diffs: Diff[]): Patch[] {
  const patches: Patch[] = [];
  let index = 0;
  for (const diff of diffs) {
    if (diff[0] === 0) {
      index += diff[1].length;
      continue;
    }

    if (diff[0] === -1) {
      patches.push({
        type: "removal",
        from: index + diff[1].length,
        length: diff[1].length,
      });
    }

    if (diff[0] === 1) {
      patches.push({
        type: "insert",
        from: index,
        text: diff[1],
      });
      index += diff[1].length;
    }
  }
  return patches;
}

function applyPatches(input: string, patches: Patch[]) {
  let output = input;

  for (const patch of patches) {
    if (patch.type === "insert") {
      output =
        output.slice(0, patch.from) + patch.text + output.slice(patch.from);
    }
    if (patch.type === "removal") {
      output =
        output.slice(0, patch.from - patch.length) + output.slice(patch.from);
    }
  }

  return { output };
}

describe("should", () => {
  it("exported", () => {
    const delta = diff(input, output);
    expect(delta).toMatchSnapshot("delta");

    const patches = calculatePath(delta);
    expect(patches).toMatchSnapshot("patches");

    const applied = applyPatches(input, patches);
    expect(applied).toMatchSnapshot("output");

    expect(applied.output).toEqual(output);
  });
});
