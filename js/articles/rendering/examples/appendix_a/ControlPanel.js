// @ts-check
import { ControlPanelForm } from "./ControlPanelForm.js";

export class ControlPanel
{
    constructor()
    {
        this.table_element = document.createElement('table');
        this.container_element = document.createElement('div');
        this.container_element.appendChild(this.table_element);
    }

    /**
     * @param {string} title 
     * @param {(Element & { title: string })[]} controls 
     */
    addForm(title, controls)
    {
        this.addTitleRow(title);
        controls.forEach(control => this.addControlRow(control.title, control));
    }
    
    /**
     * @param {string} title 
     */
    addTitleRow(title)
    {
        const tr = document.createElement('tr');
        tr.appendChild(Object.assign(document.createElement('th'), { innerText: title, colSpan: 2 }));
        this.table_element.appendChild(tr);
    }
    
    /**
     * @param {string} title 
     * @param {Element} control_element 
     */
    addControlRow(title, control_element)
    {
        const tr = document.createElement('tr');
        // const td_label = document.createElement('td');
        const td_control = document.createElement('td');
        td_control.appendChild(control_element);
        tr.appendChild(Object.assign(document.createElement('td'), { innerText: title }));
        tr.appendChild(td_control);
        this.table_element.appendChild(tr);
    }
}