function newJsDataTable(id, options) {

    //Define an array which will contain the data
    let rows = [];

    //Find tag 'div' with id = 'id'
    let dt = document.getElementById(id);

    //Add a 'table' tag
    let html = '<table class="js-table table table-striped table-bordered">';

    //Add headers
    if (options.columns) {
        let headers = '<tr class="js-table-header">'
        
        for (let i = 0; i < options.columns.length; i++) {
            headers += '<th scope="col">' + options.columns[i].header + '</th>'
        }

        headers += '</tr>'

        html += headers;
    }

    //Add rows
    if (options.type == 'client') {
        for (let i = 0; i < options.data.length; i++) {
            let row = '<tr class="js-table-row">';

            for (let j = 0; j < options.data[i].length; j++) {
                row += '<td class="js-table-cell">' + options.data[i][j] + '</td>';
            }

            row += '</tr>';
            html += row;
        }
    }

    //End of 'table' tag
    html += '</table>'
    dt.innerHTML = html;

}