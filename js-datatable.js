//Define an array which will contain all DataTables
const jsDataTables = []

class JsDataTable {
    constructor(id, options) {
        this.id = id;
        this.options = options;

        this.page = 0;
    }

    getFilteredData(search) {
        let data = [];

        if (this.options.type == 'client') {
            let index = 0;
            search = search.toLowerCase();

            while (index < this.options.data.length && data.length <= this.options.size) {
                let row = this.options.data[index];

                for (let i = 0; i < row.length; i++) {
                    if (search == '' || (row[i] + '').toLowerCase() == search) {
                        data.push(row);
                        break;
                    }
                }

                index++;
            }
        }
        
        return data;
    }
}

function searchJsDataTable(searchElement) {
    let id = searchElement.getAttribute('js-table-id');
    let table = jsDataTables.filter(x => x.id == id)[0];
    
    let html = '';
    let data = table.getFilteredData(searchElement.value);

    for (let i = 0; i < data.length; i++) {
        let row = '<tr class="js-table-row">';

        for (let j = 0; j < data[i].length; j++) {
            row += '<td class="js-table-cell">' + data[i][j] + '</td>';
        }

        row += '</tr>';
        html += row;
    }
    
    document.getElementById('js-table-' + id).getElementsByTagName('tbody')[0].innerHTML = html;
}

function newJsDataTable(id, options) {

    //Add new datatable
    let jsDataTable = new JsDataTable(
        id = id,
        options = options
    );

    jsDataTables.push(jsDataTable);

    //Find tag 'div' with id = 'id'
    let dt = document.getElementById(id);

    //Add an 'input' tag for search
    let html = '<input type="search" class="js-table-search form-control" placeholder="Search..." js-table-id="' + id + '" onchange="searchJsDataTable(this)" />';

    //Add a 'table' tag
    html += '<table id="js-table-' + id + '" class="js-table table table-striped table-bordered">';

    //Add headers
    if (options.columns) {
        let headers = '<thead class="js-table-thead"><tr class="js-table-header">'
        
        for (let i = 0; i < options.columns.length; i++) {
            headers += '<th scope="col">' + options.columns[i].header + '</th>'
        }

        headers += '</tr></thead>'

        html += headers;
    }

    //Add rows
    if (options.type == 'client') {
        let data = jsDataTable.getFilteredData('');

        for (let i = 0; i < data.length; i++) {
            let row = '<tr class="js-table-row">';

            for (let j = 0; j < data[i].length; j++) {
                row += '<td class="js-table-cell">' + data[i][j] + '</td>';
            }

            row += '</tr>';
            html += row;
        }
    }

    //End of 'table' tag
    html += '</table>'
    dt.innerHTML = html;

}