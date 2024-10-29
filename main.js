let cellCounter = 0;


function createCell(type) {
    const cell = document.createElement('div')
    cell.className = "cell"
    cell.id = `cell-${cellCounter++}`

    const header = document.createElement('div')
    header.className = "cell-header"

    const typeLabel = document.createElement('span')
    typeLabel.className = "cell-type"
    typeLabel.textContent = type === "code"? '📝 Code' : '📄 Text';


    const controls = document.createElement('div')
    controls.className = "cell-controls"

    const contents = document.createElement('div')
    contents.className = "cell-content"

    if (type === "code") {

        // editor creation & its config if it is code.
        const editor = document.createElement('textarea');
        editor.className = 'code-editor language-javascript'
        editor.placeholder = 'Enter Your Javascript code here...';
        editor.spellcheck = false;

        const output = document.createElement('div')
        output.className = 'output'
        output.style.display = 'none'

        const runBtn = document.createElement('button')
        runBtn.className = 'run-button'
        runBtn.textContent = 'Run ▶'
        runBtn.onclick = () => executeCode(editor,output)


        controls.appendChild(runBtn)
        contents.appendChild(editor)
        contents.appendChild(output)

        editor.addEventListener('input', (e) => {
            editor.style.height = "auto"
            editor.style.height = editor.scrollHeight + 'px';
        });

    } else {
        const editor = document.createElement('textarea')
        editor.className = 'text-editor'
        editor.placeholder = 'Enter your notes here...'

        contents.appendChild(editor)

        editor.addEventListener('input',() => {
            editor.style.height = "auto"
            editor.style.height = editor.scrollHeight + 'px';
        })
    }

    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '🗑️';
    deleteButton.onclick = () => cell.remove();
    controls.appendChild(deleteButton);

    header.appendChild(typeLabel)
    header.appendChild(controls)

    cell.appendChild(header)
    cell.appendChild(contents)

    return cell

}


function executeCode(editor,output) {
  output.style.display = 'block';
  output.innerHTML = '';
  
  try {
    
    const logs = []
    const customConsole = {
        log: (...args) => {
            logs.push(args.map(arg => (
                typeof arg === 'object' ? JSON.stringify(arg,null,2): String(arg)
            )).join(' '))
        },
    }

    const code = `
        const console = customConsole;
        ${editor.value}
    `;

    new Function('customConsole',code)(customConsole)

    if (logs.length > 0) {
      output.textContent = logs.join('\n');
    } else {
      output.textContent = '✓ Code executed successfully';
    }    

  } catch (error) {
    output.innerHTML = `<div class="error">🚫 ${error.message}</div>`
  }
}


window.addCell = function(type) {
    const notebook = document.getElementById("notebook")
    const cell = createCell(type)
    notebook.insertBefore(cell, notebook.lastElementChild)
}

addCell('code')