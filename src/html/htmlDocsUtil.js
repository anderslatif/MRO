export function getHTMLDocument(tables, database) {
  const htmlTop = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <style>
            body {
                margin: 5vw;
                background: #fafafa;
                font-family: "Roboto", "Helvetica", "Arial", sans-serif;
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
                background: hsla(0, 0%, 100%, .8);
            }
            
            tr:nth-child(even) {
                background-color: rgba(97, 175, 254, .1);
            }
            
            tbody tr:hover {
                background: rgba(0, 0, 0, .02);
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
            <br><br>
            <footer>Powered by MRO</footer>
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
            <tr>
                ${databaseFields.map(columnKey => `<th>${columnKey}</th>`).join('')}                 
            </tr>
    `;
  const htmlTableHeadersEnd = `
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

  return htmlTableTitle + htmlTableHeaders + htmlTableHeadersEnd + htmlTableRows + htmlTableBodyEnd;
}
