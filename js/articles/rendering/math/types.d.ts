declare namespace Articles.Rendering.Math
{
    type Vector<N extends number> = FixedArray<number, N>
    type Vector2 = Vector<2>
    type Vector3 = Vector<3>
    type Vector4 = Vector<4>
    
    type Matrix<M extends number, N extends number> = FixedArray<FixedArray<number, M>, N>
    type MatrixN<N extends number> = Matrix<N, N>
    type Matrix4 = MatrixN<4>
    
    type Triangle2 = FixedArray<Vector2, 3>
    type Triangle4 = FixedArray<Vector4, 3>

    interface IBarycentricCoordinatesConverter
    {
        convert(point: Vector2): Vector2
    }
}