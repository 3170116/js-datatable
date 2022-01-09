//Define an array which will contain all DataTables
const jsDataTables = []

class JsDataTable {
    constructor(id, options) {
        this.id = id;
        this.options = options;

        this.page = 0;
        this.search = '';
    }

    getFilteredData(search, start) {
        let data = [];

        this.search = search == undefined ? this.search : search.toLowerCase();

        if (this.options.type == 'client') {
            let index = start;

            while (index < this.options.data.length && data.length < this.options.size) {
                let row = this.options.data[index];

                for (let i = 0; i < row.length; i++) {
                    if ((row[i] + '').toLowerCase().includes(this.search)) {
                        data.push(row);
                        break;
                    }
                }

                index++;
            }
        }
        
        return data;
    }

    getPagination() {
        let pagination = '<ul class="pagination">';

        if (this.options.type == 'client') {
            for (let i = 0, j = 0; j < this.getAvailablePaginations(); i += this.options.size, j++) {
                pagination += '<li class="page-item' + (this.page == i ? ' active' : '') + '"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,' + i + ')">' + (j + 1) + '</a></li>';
            }
        }

        pagination += '</ul>'
        return pagination;
    }

    getAvailablePaginations() {
        let paginations = 0;

        if (this.options.type == 'client') {
            let index = 0;

            while (index < this.options.data.length) {
                let row = this.options.data[index];

                for (let i = 0; i < row.length; i++) {
                    if ((row[i] + '').toLowerCase().includes(this.search)) {
                        paginations++;
                        break;
                    }
                }

                index++;
            }
        }

        return paginations / this.options.size;
    }
}

function searchJsDataTable(searchElement) {
    let id = searchElement.getAttribute('js-table-id');
    let table = jsDataTables.filter(x => x.id == id)[0];
    
    let html = '';
    let data = table.getFilteredData(searchElement.value, 0);

    for (let i = 0; i < data.length; i++) {
        let row = '<tr class="js-table-row">';

        for (let j = 0; j < data[i].length; j++) {
            row += '<td' + (table.options.columns[j].type == 'number' ? ' class="js-table-cell js-table-number"' : ' class="js-table-cell"') + ' >' + data[i][j] + '</td>';
        }

        row += '</tr>';
        html += row;
    }
    
    table.page = 0;
    
    document.getElementById('js-table-' + id).getElementsByTagName('tbody')[0].innerHTML = html;
    document.getElementsByClassName('js-table-pagination-list')[0].innerHTML = table.getPagination();
}

function setJsDataTablePage(pagingElement, page) {
    let id = pagingElement.getAttribute('js-table-id');
    let table = jsDataTables.filter(x => x.id == id)[0];

    table.page = page;
    
    let html = '';
    let data = table.getFilteredData(undefined, page);

    for (let i = 0; i < data.length; i++) {
        let row = '<tr class="js-table-row">';

        for (let j = 0; j < data[i].length; j++) {
            row += '<td' + (table.options.columns[j].type == 'number' ? ' class="js-table-cell js-table-number"' : ' class="js-table-cell"') + ' >' + data[i][j] + '</td>';
        }

        row += '</tr>';
        html += row;
    }
    
    document.getElementById('js-table-' + id).getElementsByTagName('tbody')[0].innerHTML = html;
    document.getElementsByClassName('js-table-pagination-list')[0].innerHTML = table.getPagination();
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
            headers += '<th' + (options.columns[i].type == 'number' ? ' class="js-table-number"' : ' ') + 'scope="col">' + options.columns[i].header + '</th>'
        }

        headers += '</tr></thead>'

        html += headers;
    }

    //Add rows
    if (options.type == 'client') {
        let data = jsDataTable.getFilteredData('', 0);

        for (let i = 0; i < data.length; i++) {
            let row = '<tr class="js-table-row">';

            for (let j = 0; j < data[i].length; j++) {
                row += '<td' + (options.columns[j].type == 'number' ? ' class="js-table-cell js-table-number"' : ' class="js-table-cell"') + '>' + data[i][j] + '</td>';
            }

            row += '</tr>';
            html += row;
        }
    }

    //End of 'table' tag
    html += '</table>'

    //Add pagination
    let pagination = '<nav class="js-table-pagination-list" js-table-id="' + id + '">' + jsDataTable.getPagination() + '</nav>';
    html += pagination;

    dt.innerHTML = html;

}