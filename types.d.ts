// @ts-check

declare namespace Articles.Rendering
{
    type IndexedMesh<N extends number> = { vertices: FixedArray<Math.Vector3, N>, indices: Math.Vector3[] }

    // To verify:

    type FixedArray<T, N extends number> = [T, ...T[]] & { length: N }

    namespace Math
    {
    }
    
    namespace JS.Parsing
    {
        type Part = (Comment | JSDoc | Function | Code | Class)
        type Fragment = import("./js/utilities/generated-content/js-quasi-parser/FragmentNode").FragmentNode
        type JSDoc = { type: 'jsdoc', source_lines: string[], previous_part: Part | undefined }
        type Code = import("./js/utilities/generated-content/js-quasi-parser/CodeNode").CodeNode
        type Function = import("./js/utilities/generated-content/js-quasi-parser/FunctionNode").FunctionNode
        type Comment = import("./js/utilities/generated-content/js-quasi-parser/CommentNode").CommentNode
        type Class = import("./js/utilities/generated-content/js-quasi-parser/ClassNode").ClassNode
        interface PartParser<T extends Part>
        {
            type: T['type']
            pattern: RegExp
            append: (part: T, source_line: string) => void
            create: (source_line: string) => T
        }
        type ParsingState = { position: number, source_lines: string[], block_depth: number }
    }


    type VertexShaderMain<TUniforms, TInput, TOutput> = ((uniforms: TUniforms, input: TInput, output: TOutput) => void)

    type DrawData<TVertexShaderInput> =
    {
        indices: Math.Vector3[],
        attributes: DrawDataAttributes<TVertexShaderInput>
    }

    type DrawDataAttributes<T> = { [Property in keyof T]: T[Property][] }

    // type Remap<T> = { [Property in keyof T as Property]: string }
    
    interface IVertexShaderAttribute<T>
    {
        createValue(): T
    }

    interface IFragmentShaderAttribute<T> extends IVertexShaderAttribute<T>
    { 
        interpolate(values: FixedArray<T, 3>, interpolation: FixedArray<number, 3>, result: T): void
    }
    
    type ShaderMainFunction<TUniforms, TInput, TOutput> = ((uniforms: TUniforms, input: TInput, output: TOutput) => void)

    type VertexShaderAtributes<T> = { [Property in keyof T]: IVertexShaderAttribute<T[Property]> }
    
    type VertexShader<TUniforms, TInput, TOutput> = ((uniforms: TUniforms, input: TInput, output: TOutput) => void) 
    &
    {
        input_attributes: VertexShaderAtributes<TInput>
    }

    type FragmentShader<TUniforms, TInput> = ShaderMainFunction<TUniforms, TInput, { color: Articles.Rendering.Math.Vector4 }> &
    {
        input_attributes: { [Property in keyof TInput]: IFragmentShaderAttribute<TInput[Property]> }
    }

    // type ShaderAttributeValues<T extends Record<string, Articles.Rendering.IShaderAttribute<any>>> =
    // {
    //     [Property in keyof T]: ReturnType<T[Property]["createValue"]>
    // }
}
