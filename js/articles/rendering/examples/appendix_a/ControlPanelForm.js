// @ts-check

export class ControlPanelForm
{
    constructor()
    {
        this.element = document.createElement('table');
    }

    /**
     * @param {string} title 
     * @param {Element} control_element 
     */
    add(title, control_element)
    {
        const tr = document.createElement('tr');
        // const td_label = document.createElement('td');
        const td_control = document.createElement('td');
        td_control.appendChild(control_element);
        tr.appendChild(Object.assign(document.createElement('td'), { innerText: title }));
        tr.appendChild(td_control);
        this.element.appendChild(tr);
    }
}