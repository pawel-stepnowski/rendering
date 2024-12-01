// @ts-check

const SUBSCRIPT_DIGITS = '₀₁₂₃₄₅₆₇₈₉';

export class PlaneCanvas
{
    /**
     * @param {HTMLCanvasElement} [element]
     */
    constructor(element)
    {
        if (element) 
        {
            this.element = element;
        }
        else
        {
            this.element = document.createElement('canvas');
            this.element.width = 600;
            this.element.height = 600;
        }
        this.metrics =
        {
            width_half: this.element.width * 0.5,
            height_half: this.element.width * 0.5
        };
        this.context = this.element.getContext('2d');
        if (!this.context) throw new Error();
        this.scale =
        {
            to_plane: [2, 2],
            to_canvas: [0.5, 0.5]
        };
        this.context.transform
    }

    clear()
    {
        const { width, height } = this.element;
        this.context.clearRect(0, 0, width, height);
    }

    drawAxisX()
    {
        const { width: W, height: H } = this.element;
        const ctx = this.context;
        const y = this.toCanvasY(0);
        const d = Math.PI / 2;
        let k = Math.floor(this.toPlaneX(0) / d);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
        ctx.textAlign = 'center';
        for (let x = this.toCanvasX(k * d); x < W; k++, x = this.toCanvasX(k * d))
        {
            ctx.beginPath();
            ctx.moveTo(x, y - 5);
            ctx.lineTo(x, y + 5);
            ctx.stroke();
            ctx.fillText('a', x, y - 10);
        }
    }

    /**
     * @param {[number, number]} value
     */
    set scale_to_plane(value)
    {
        this.scale.to_plane = [...value];
        this.scale.to_canvas = value.map(v => 1 / v);
    }

    /**
     * @param {number} x
     */
    toPlaneX(x)
    {
        const { width_half } = this.metrics;
        return ((x - width_half) / width_half) * this.scale.to_plane[0];
    }

    /**
     * @param {number} x
     */
    toCanvasX(x)
    {
        const { width_half } = this.metrics;
        return x * this.scale.to_canvas[0] * width_half + width_half;
    }

    /**
     * @param {number} y
     */
    toCanvasY(y)
    {
        const { height_half } = this.metrics;
        return height_half - y * this.scale.to_canvas[1] * height_half;
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} deg 
     */
    drawPoint(x, y, deg)
    {
        const ctx = this.context;
        const cx = this.toCanvasX(y);
        const cy = this.toCanvasY(x);
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${deg}deg 100% 60%)`;
        ctx.fill();
        ctx.strokeStyle = `hsl(${deg}deg 100% 25%)`;
        ctx.stroke();
    }
    
    /**
     * @param {(x: number) => number} f 
     * @param {{ swap_axes?: boolean }} [options]
     */
    drawFunction(f, options)
    {
        const ctx = this.context;
        const swap_axes = options?.swap_axes ?? false;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let cx = 1; cx < 600; cx++)
        {
            const cy = this.toCanvasY(f(this.toPlaneX(cx)));
            if (swap_axes) ctx.lineTo(cy, cx);
            else ctx.lineTo(cx, cy);
        }
        ctx.stroke();
    }

    /**
     * @param {[number, number][] | Articles.Rendering.Math.Vector2[]} points 
     * @param {{ color?: string, point_label?: string, draw_points?: boolean }} [options]
     */
    drawPath(points, options)
    {
        const ctx = this.context;
        const path = new Path2D();
        path.moveTo(this.toCanvasX(points[0][0]), this.toCanvasY(points[0][1]));
        for (let i = 1; i < points.length; i++) path.lineTo(this.toCanvasX(points[i][0]), this.toCanvasY(points[i][1]));
        path.closePath();
        ctx.strokeStyle = options?.color ?? 'black';
        ctx.fillStyle = options?.color ?? 'black';
        ctx.stroke(path);
        ctx.font = '1em math';
        ctx.textAlign = 'center';
        let i = 1;
        if (options?.draw_points || options?.point_label)
        {
            for (const [px, py] of points) 
            {
                const cx = this.toCanvasX(px);
                const cy = this.toCanvasY(py);
                ctx.beginPath();
                ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                if (options?.point_label)
                {
                    const label = options.point_label.replaceAll('ᵢ', SUBSCRIPT_DIGITS[i]);
                    ctx.fillText(label, cx, cy + (py > 0 ? -12 : 20));
                }
                i++;
            }
        }
    }
}