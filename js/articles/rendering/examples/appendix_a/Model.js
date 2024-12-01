// @ts-check
import { Matrix4 } from "../../math/index.js"

/**
 * @template {number} N
 */
export class Model
{
    /**
     * @param {Articles.Rendering.IndexedMesh<N>} mesh
     * @param {Articles.Rendering.FixedArray<Articles.Rendering.Math.Vector3, N>} vertex_colors
     * @param {Articles.Rendering.Math.Vector3} translation
     */
    constructor(mesh, vertex_colors, translation)
    {
        this.transform = 
        {
            translation: Matrix4.createTranslation(translation),
            rotation: Matrix4.createIdentity()
        }
        this.draw_data =
        {
            indices: mesh.indices,
            attributes:
            {
                position: mesh.vertices,
                color: vertex_colors
            }
        }
    }
}