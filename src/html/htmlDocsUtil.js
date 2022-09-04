

export function getHTMLDocument(tables, database) {
    const htmlTop = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <style>
            h1 {
                text-align: center;
            }
            
            table, th, td {
                border: 1px solid black;
            }
    
            main {
                min-height: calc(100vh - 40px);
                margin: 0 4em 0 4em;
            }
    
            table {
                width: 100%;
            }
    
            footer {
                color: grey;
                font-size: 0.8em;
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

    const htmlTables = tables.map(table => createHTMLTableForDatabaseTable(table)).join("");
    return htmlTop + htmlTables + htmlBottom;
}

function createHTMLTableForDatabaseTable(table) {
    const databaseFields = Object.keys(table.columns[0]);

    const htmlTableTitle = `
        <h2 class="database-table-name">${table.table}</h2>`;
    const htmlTableHeaders = `
        <table class="database-table-body">
            <tr>
                ${databaseFields.map(columnKey => `<th>${columnKey}</th>`).join("")}                 
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
                    ${databaseFields.map(field => `<td>${column[field] || ''}</td>`).join("")}
                </tr>
                `;
            }).join("")}
    `;

    const htmlTableBodyEnd = `
        </tbody>
        </table>
    `;

    return htmlTableTitle + htmlTableHeaders + htmlTableHeadersEnd + htmlTableRows + htmlTableBodyEnd;
}


