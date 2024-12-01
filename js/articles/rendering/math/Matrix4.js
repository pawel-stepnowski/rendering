// @ts-check

export class Matrix4
{
    /**
     * @param {Articles.Rendering.Math.Matrix4} values 
     */
    static createFromValues(values)
    {
        return values;
    }

    /**
     * @returns {Articles.Rendering.Math.Matrix4}
     */
    static createIdentity()
    {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    /**
     * @param {number} radians 
     * @returns {Articles.Rendering.Math.Matrix4}
     */
    static createRotationX(radians)
    {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        return [
            [1,   0,    0, 0],
            [0, cos, -sin, 0],
            [0, sin,  cos, 0],
            [0,   0,    0, 1]
        ];
    }

    /**
     * @param {number} radians 
     * @returns {Articles.Rendering.Math.Matrix4}
     */
    static createRotationY(radians)
    {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        return [
            [ cos, 0, sin, 0],
            [   0, 1,   0, 0],
            [-sin, 0, cos, 0],
            [   0, 0,   0, 1]
        ];
    }

    /**
     * @param {Articles.Rendering.Math.Vector3} translation 
     * @returns {Articles.Rendering.Math.Matrix4}
     */
    static createTranslation([x, y, z])
    {
        return [
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1]
        ];
    }

    /**
     * @param {number} near
     * @param {number} far
     * @param {number} left
     * @param {number} right
     * @param {number} top
     * @param {number} bottom
     */
    static createPerspectiveProjection(near, far, left, right, top, bottom)
    {
        const xx = (2 * near) / (right - left);
        const yy = (2 * near) / (top - bottom);
        const zz = -(far + near) / (far - near);
        const xz = (right + left) / (right - left);
        const yz = (top + bottom) / (top - bottom);
        const zt = -(2 * near * far) / (far - near);
        return Matrix4.createFromValues
        ([
            [xx,  0, xz,  0],
            [ 0, yy, yz,  0],
            [ 0,  0, zz, zt],
            [ 0,  0, -1,  0],
        ]);
    }
}