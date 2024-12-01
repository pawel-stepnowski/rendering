// @ts-check

export class AppendixB
{
    static vertex_shader_code = `#version 300 es
in vec3 coordinates;
in vec3 color;
out vec3 fragment_color;

void main()
{
    fragment_color = color;
    gl_Position = vec4(coordinates, 1.0);
}`;

    static fragment_shader_code = `#version 300 es
precision highp float;
in vec3 fragment_color;
out vec4 output_color;

void main()
{
    output_color = vec4(fragment_color, 1.0);
}`;

    static vertices =
    [
        [-1, -1, 0],
        [ 0,  1, 0], 
        [ 1, -1, 0]
    ];
    static colors =
    [
        [1, 0, 0],
        [0, 1, 0], 
        [0, 0, 1]
    ];
    static indices = [0, 1, 2];

    constructor()
    {
        this.element = document.createElement('canvas');
        this.element.width = 640;
        this.element.height = 480;
        this.context = this.element.getContext('webgl2');
        if (!this.context) throw new Error();
        const gl = this.context;

        const vertex_shader = this.compileShader(gl.VERTEX_SHADER, AppendixB.vertex_shader_code);
        const fagment_shader = this.compileShader(gl.FRAGMENT_SHADER, AppendixB.fragment_shader_code);
        this.shader_program_handle = gl.createProgram();
        if (!this.shader_program_handle) throw new Error();
        gl.attachShader(this.shader_program_handle, vertex_shader.handle);
        gl.attachShader(this.shader_program_handle, fagment_shader.handle);
        gl.linkProgram(this.shader_program_handle);
        if (!gl.getProgramParameter(this.shader_program_handle, gl.LINK_STATUS))
        {
            const log = gl.getProgramInfoLog(this.shader_program_handle);
            throw new Error(`${log}`);
        }

        this.vertex_array = gl.createVertexArray();
        gl.bindVertexArray(this.vertex_array);

        this.vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(AppendixB.vertices.flat()), gl.STATIC_DRAW);
        const coordinates_attribute_location = gl.getAttribLocation(this.shader_program_handle, "coordinates");
        gl.vertexAttribPointer(coordinates_attribute_location, 3, gl.FLOAT, false, 0, 0); 
        gl.enableVertexAttribArray(coordinates_attribute_location);

        this.color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(AppendixB.colors.flat()), gl.STATIC_DRAW);
        const color_attribute_location = gl.getAttribLocation(this.shader_program_handle, "color");
        gl.vertexAttribPointer(color_attribute_location, 3, gl.FLOAT, false, 0, 0); 
        gl.enableVertexAttribArray(color_attribute_location);
        
        this.index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(AppendixB.indices), gl.STATIC_DRAW);
        
        gl.bindVertexArray(null);
    }

    /**
     * @param {GLenum} shader_type 
     * @param {string} source_code 
     */
    compileShader(shader_type, source_code)
    {
        const gl = this.context;
        const handle = gl.createShader(shader_type);
        if (!handle) throw new Error();
        gl.shaderSource(handle, source_code);
        gl.compileShader(handle);
        if (!gl.getShaderParameter(handle, gl.COMPILE_STATUS))
        {
            const log = gl.getShaderInfoLog(handle);
            throw new Error(`${log}`);
        }
        return { handle };
    }
    
    render()
    {
        const gl = this.context;
        gl.useProgram(this.shader_program_handle);
        gl.bindVertexArray(this.vertex_array);
        gl.drawElements(gl.TRIANGLES, AppendixB.indices.length, gl.UNSIGNED_SHORT,0);
    }
}