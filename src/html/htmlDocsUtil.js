export function getHTMLDocument(tables, database) {
  const htmlTop = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <style>
            html, body {
                height: 100%;
            }

            body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;

                background: #fafafa;
                font-family: "Roboto", "Helvetica", "Arial", sans-serif;
            }

            main {
                margin: 5vw;
                flex: 1;
            }
            
            h1, h2 {
                font-family: Titillium Web, sans-serif;
                color: #3b4151;
            }
            
            h1 {
                font-size: 36px;
            }
            
            h2 {
                font-size: 24px;
                margin-bottom: 10px;
            }
            
            table {
                width: 100%;
                margin-bottom: 15px;
                border-collapse: collapse;
                border-radius: 4px;
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
                background: #ffffff;
            }
            
            th, td {
                font-size: 14px;
                padding: 10px;
                text-align: left;
                font-family: Source Code Pro, monospace;
                font-weight: 600;
                color: #3b4151;
                border-bottom: 1px solid rgba(59, 65, 81, .2);
            }
            
            th {
                font-weight: 700;
                background-color: darkgrey;
            }
            
            tr:nth-child(even) {
                background-color: rgba(97, 175, 254, .1);
            }
            
            tbody tr:hover {
                background: rgba(0, 0, 0, .02);
            }
            
            footer {
                margin-top: 2rem;
                margin-bottom: 0.5rem;
                margin-left: 1rem;
            }
        </style>
        <title>%%DATABASE_NAME%% - Docs</title>
    </head>
    <body>
        <main>
            <h1>%%DATABASE_NAME%%</h1>
    
            <div class="database-table">`
    .replaceAll('%%DATABASE_NAME%%', database);

  const htmlBottom = `</div>
            </main> 
            <footer>
                <a href="https://www.npmjs.com/package/mro">Powered by MRO</a>
            </footer>
        </body>
        </html>`;

  const htmlTables = tables.map(table => createHTMLTableForDatabaseTable(table)).join('');
  return htmlTop + htmlTables + htmlBottom;
}

function createHTMLTableForDatabaseTable(table) {
  const databaseFields = Object.keys(table.columns[0]);

  const htmlTableTitle = `
        <h2 class="database-table-name">${table.table}</h2>`;
  const htmlTableHeaders = `
        <table class="database-table-body">
            <thead>
                <tr>
                    ${databaseFields.map(columnKey => `<th>${columnKey}</th>`).join('')}                 
                </tr>
            </thead>
            <tbody>
    `;
  const htmlTableRows = `
            ${table.columns.map(column => {
    return `
                <tr>
                    ${databaseFields.map(field => `<td>${column[field] || ''}</td>`).join('')}
                </tr>
                `;
  }).join('')}
    `;

  const htmlTableBodyEnd = `
        </tbody>
        </table>
    `;

  return htmlTableTitle + htmlTableHeaders + htmlTableRows + htmlTableBodyEnd;
}
