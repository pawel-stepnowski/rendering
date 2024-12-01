// @ts-check
import { FixedArray } from "../FixedArray.js";
import { Vector3 } from "./math/index.js";

export class MeshFactory
{
    /**
     * @returns {Articles.Rendering.IndexedMesh<8>}
     */
    static createBox()
    {
        const vertices = FixedArray.createFromValues
        ([
            Vector3.createFromValues([-1,  1, -1]),
            Vector3.createFromValues([ 1,  1, -1]),
            Vector3.createFromValues([ 1, -1, -1]),
            Vector3.createFromValues([-1, -1, -1]),
            Vector3.createFromValues([-1,  1,  1]),
            Vector3.createFromValues([ 1,  1,  1]),
            Vector3.createFromValues([ 1, -1,  1]),
            Vector3.createFromValues([-1, -1,  1])
        ]);
        const indices = FixedArray.createFromValues(
        [
            Vector3.createFromValues([0, 1, 2]),
            Vector3.createFromValues([0, 2, 3]),
            Vector3.createFromValues([5, 4, 7]),
            Vector3.createFromValues([5, 7, 6]),
            Vector3.createFromValues([1, 5, 6]),
            Vector3.createFromValues([1, 6, 2]),
            Vector3.createFromValues([4, 0, 3]),
            Vector3.createFromValues([4, 3, 7]),
        ]);
        return { vertices, indices };
    }
}
