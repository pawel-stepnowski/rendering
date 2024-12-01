// @ts-check
import { FixedArray } from "../../../FixedArray.js";
import { Vector3, Matrix, Matrix4, ONE_DEGREE_IN_RADIANS,  } from "../../math/index.js";
import { MeshFactory } from "../../MeshFactory.js";
import { Renderer } from "../../Renderer.js";
import { ShaderAttributeVector3 } from "../../ShaderAttributeVector3.js";
import { ShaderAttributeVector4 } from "../../ShaderAttributeVector4.js";
import { ControlPanel } from "./ControlPanel.js";
import { Model } from "./Model.js";

export class Scene
{
    static uniforms =
    {
        projection: Matrix4.createPerspectiveProjection(0.1, 100, -0.125, 0.125, 0.125, -0.125),
        model: Matrix4.createRotationY(0),
        view: Matrix4.createTranslation([0, 0, 0]),
    };
    
    /** @typedef {{ position: Articles.Rendering.Math.Vector3, color: Articles.Rendering.Math.Vector3 }} VertexShaderInput */

    /**
     * @param {typeof Scene.uniforms} uniforms 
     * @param {VertexShaderInput} input 
     * @param {FragmentShaderInput} output 
     */
    static vertexShader(uniforms, input, output)
    {
        const [x, y, z] = input.position;
        const vertex1 = Matrix.mulVector(uniforms.model, [x, y, z, 1]);
        const vertex2 = Matrix.mulVector(uniforms.view, vertex1);
        output.color = input.color;
        Matrix.mulVector(uniforms.projection, vertex2, output.position);
    }
    
    /** @typedef {{ position: Articles.Rendering.Math.Vector4, color: Articles.Rendering.Math.Vector3 }} FragmentShaderInput */

    /**
     * @param {typeof Scene.uniforms} uniforms 
     * @param {FragmentShaderInput} input 
     * @param {{ color: Articles.Rendering.Math.Vector4 }} output 
     */
    static fragmentShader(uniforms, input, output)
    {
        const [r, g, b] = input.color;
        output.color = [r, g, b, 1];
    }
        
    constructor()
    {
        this.models = this._createModels();
        const vertex_shader_input_attributes =
        {
            position: new ShaderAttributeVector3(), 
            color: new ShaderAttributeVector3()
        };
        const fragment_shader_input_attributes =
        {
            position: new ShaderAttributeVector4(), 
            color: new ShaderAttributeVector3() 
        };
        const vertex_shader = Object.assign(Scene.vertexShader, { input_attributes: vertex_shader_input_attributes });
        const fragment_shader = Object.assign(Scene.fragmentShader, { input_attributes: fragment_shader_input_attributes });
        this.renderer = new Renderer(vertex_shader, fragment_shader, Scene.uniforms);
        this.camera = { phi: 0, theta: 0, translation: Matrix4.createTranslation([0, 0, -8]) };
        this.controls =
        {
            model_rotation_y: Object.assign(document.createElement('input'), { title: 'Rotation', type: 'range', min: 0, max: 360, step: 1, value: 0 }),
            camera_rotation_phi: Object.assign(document.createElement('input'), { title: 'Rotation Phi', type: 'range', min: 0, max: 360, step: 1, value: 0 }),
            camera_rotation_theta: Object.assign(document.createElement('input'), { title: 'Rotation Theta', type: 'range', min: 0, max: 360, step: 1, value: 0 }),
        };
        this.control_panel = new ControlPanel();
        this.control_panel.addForm('Middle Box', [this.controls.model_rotation_y]);
        this.control_panel.addForm('Camera', [this.controls.camera_rotation_phi, this.controls.camera_rotation_theta]);
        this.controls.model_rotation_y.addEventListener('input', () => this.render());
        this.controls.camera_rotation_phi.addEventListener('input', () => this.render());
        this.controls.camera_rotation_theta.addEventListener('input', () => this.render());
    }

    _createModels()
    {
        const box_mesh = MeshFactory.createBox();
        const box_vertex_colors = FixedArray.createFromValues
        ([
            Vector3.createFromValues([1, 0, 0]),
            Vector3.createFromValues([0, 1, 0]),
            Vector3.createFromValues([0, 0, 1]),
            Vector3.createFromValues([1, 0, 0]),
            Vector3.createFromValues([0, 1, 0]),
            Vector3.createFromValues([0, 0, 1]),
            Vector3.createFromValues([1, 0, 0]),
            Vector3.createFromValues([0, 1, 0])
        ]);
        const models =
        [
            new Model(box_mesh, box_vertex_colors, [-5, 0, 0]),
            new Model(box_mesh, box_vertex_colors, [ 0, 0, 0]),
            new Model(box_mesh, box_vertex_colors, [ 5, 0, 0]),
        ];
        return models;
    }

    render()
    {
        this.renderer.clear();
        this.camera.phi = this.controls.camera_rotation_phi.valueAsNumber * ONE_DEGREE_IN_RADIANS;
        this.camera.theta = this.controls.camera_rotation_theta.valueAsNumber * ONE_DEGREE_IN_RADIANS;
        this.models[1].transform.rotation = Matrix4.createRotationY(this.controls.model_rotation_y.valueAsNumber * ONE_DEGREE_IN_RADIANS);
        const view_rotation_y = Matrix4.createRotationY(this.camera.phi);
        const view_rotation_x = Matrix4.createRotationX(this.camera.theta);
        const view_rotation = Matrix.mul(view_rotation_y, view_rotation_x);
        Matrix.mul(this.camera.translation, view_rotation, this.renderer.uniforms.view);
        for (const model of this.models)
        {
            Matrix.mul(model.transform.rotation, model.transform.translation, this.renderer.uniforms.model);
            this.renderer.draw(model.draw_data);
        }
        this.renderer.context.putImageData(this.renderer.image_data, 0, 0);
    }
}