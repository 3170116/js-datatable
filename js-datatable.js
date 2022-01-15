//Define an array which will contain all DataTables
const jsDataTables = []

class JsDataTable {
    constructor(id, options) {
        this.id = id;
        this.options = options;

        this.page = 0;
        this.search = '';
        this.sort = [];
    }

    getHeadersToDisplay() {
        let headers = '';
        
        for (let i = 0; i < this.options.columns.length; i++) {
            let numberClass = this.options.columns[i].type == 'number' ? 'js-table-number' : '';
            let sortableClass = (this.options.columns[i].sortable == undefined || (this.options.columns[i].sortable != undefined && this.options.columns[i].sortable == true)) ? 'js-table-sortable' : '';
            
            headers += '<th class="' + numberClass + ' ' + sortableClass + '" scope="col" ';

            if (sortableClass != '') {
                headers += 'onclick="setJsDataTableSort(\'' + this.id + '\',' + i + ')"';
            }

            let arrow = '';

            if (this.sort[i] == 0) {
                arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>';
            } else if (this.sort[i] == 1) {
                arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg>';
            }

            headers += '>' + this.options.columns[i].header + arrow + '</th>';
        }

        return headers;
    }

    getPagersToDisplay() {
        let pagers = '<select class="js-table-pagers form-control" js-table-id="' + this.id + '" onchange="setJsDataTableSize(this)">';

        for (let i = 0; i < this.options.pagers.length; i++) {
            pagers += '<option value="' + this.options.pagers[i] + '"' + (this.options.pagers[i] == this.options.size ? ' selected' : '') + '>' + (this.options.pagers[i] == -1 ? 'All': this.options.pagers[i]) + '</option>';
        }

        pagers += '</select>';
        return pagers;
    }
    
    getDataToDisplay(search, start) {
        let html = '';

        if (this.options.type == 'client') {
            let data = this.getFilteredData(search, start);

            for (let i = 0; i < data.length; i++) {
                let row = '<tr class="js-table-row">';

                for (let j = 0; j < data[i].length; j++) {
                    let cell = this.options.columns[j].display == undefined ? data[i][j] : this.options.columns[j].display(data[i]);
                    row += '<td' + (this.options.columns[j].type == 'number' ? ' class="js-table-cell js-table-number"' : ' class="js-table-cell"') + ' >' + cell + '</td>';
                }

                row += '</tr>';
                html += row;
            }
        }

        return html;
    }

    getFilteredData(search, start) {
        let data = [];

        this.search = search == undefined ? this.search : search.toLowerCase();

        if (this.options.type == 'client') {
            let index = 0;

            while (index < this.options.data.length) {
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

        data = data.splice(start);

        if (data.length > this.options.size) {
            data = data.splice(0, this.options.size);
        }
        
        return data;
    }

    getPagination() {
        let pagination = '<ul class="pagination">';
        let availablePaginations = this.getAvailablePaginations();

        if (this.options.type == 'client') {
            pagination += '<li class="page-item"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePreviousPage(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg></a></li>';

            if (availablePaginations <= 6) {
                for (let i = 0, j = 0; j < availablePaginations; i += this.options.size, j++) {
                    pagination += '<li class="page-item' + (this.page == i ? ' active' : '') + '"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,' + i + ')">' + (j + 1) + '</a></li>';
                }
            } else {
                if (this.page <= this.options.size || this.page >= ((availablePaginations - 2) * this.options.size))  {
                    pagination += '<li class="page-item' + (this.page == 0 ? ' active' : '') + '"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,0)">1</a></li>';
                    pagination += '<li class="page-item' + (this.page == this.options.size ? ' active' : '') + '"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,' + this.options.size + ')">2</a></li>';

                    pagination += '<li class="page-item"><a class="js-table-page-link page-link js-table-page-more">...</a></li>';
                    pagination += '<li class="page-item"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,' + (Math.floor(availablePaginations / 2) * this.options.size) + ')">' + Math.round(availablePaginations / 2) + '</a></li>';
                    pagination += '<li class="page-item"><a class="js-table-page-link page-link js-table-page-more">...</a></li>';

                    pagination += '<li class="page-item' + (this.page == (availablePaginations - 2) * this.options.size ? ' active' : '') + '"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,' + ((availablePaginations - 2) * this.options.size) + ')">' + (availablePaginations - 1) + '</a></li>';
                    pagination += '<li class="page-item' + (this.page == (availablePaginations - 1) * this.options.size ? ' active' : '') + '"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,' + ((availablePaginations - 1) * this.options.size) + ')">' + availablePaginations + '</a></li>';
                } else {
                    pagination += '<li class="page-item"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,0)">1</a></li>';
                    pagination += '<li class="page-item"><a class="js-table-page-link page-link js-table-page-more">...</a></li>';

                    pagination += '<li class="page-item"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,' + (this.page - this.options.size) + ')">' + Math.round(this.page / this.options.size) + '</a></li>';
                    pagination += '<li class="page-item active"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,' + this.page + ')">' + (Math.round(this.page / this.options.size) + 1) + '</a></li>';
                    pagination += '<li class="page-item"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,' + (this.page + this.options.size) + ')">' + (Math.round(this.page / this.options.size) + 2) + '</a></li>';

                    pagination += '<li class="page-item"><a class="js-table-page-link page-link js-table-page-more">...</a></li>';
                    pagination += '<li class="page-item"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTablePage(this,' + ((availablePaginations - 1) * this.options.size) + ')">' + availablePaginations + '</a></li>';
                }
            }

            pagination += '<li class="page-item"><a class="js-table-page-link page-link" js-table-id="' + this.id + '" onclick="setJsDataTableNextPage(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></a></li>';
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

        return Math.round(paginations / this.options.size);
    }
}

function searchJsDataTable(searchElement) {
    let id = searchElement.getAttribute('js-table-id');
    let table = jsDataTables.filter(x => x.id == id)[0];
    
    let html = table.getDataToDisplay(searchElement.value, 0);
    table.page = 0;
    
    document.getElementById('js-table-' + id).getElementsByTagName('tbody')[0].innerHTML = html;
    document.getElementsByClassName('js-table-pagination-list')[0].innerHTML = table.getPagination();
}

function setJsDataTablePage(pagingElement, page) {
    let id = pagingElement.getAttribute('js-table-id');
    let table = jsDataTables.filter(x => x.id == id)[0];

    table.page = page;
    let html = table.getDataToDisplay(table.search, page);
    
    document.getElementById('js-table-' + id).getElementsByTagName('tbody')[0].innerHTML = html;
    document.getElementsByClassName('js-table-pagination-list')[0].innerHTML = table.getPagination();
}

function setJsDataTableSize(selectElement) {
    let id = selectElement.getAttribute('js-table-id');
    let table = jsDataTables.filter(x => x.id == id)[0];

    table.page = 0;
    table.options.size = selectElement.value;

    if (selectElement.value == -1 && table.options.type == 'client') {
        table.options.size = table.options.data.length;
    }
    
    let html = table.getDataToDisplay(table.search, table.page);

    document.getElementById('js-table-' + id).getElementsByTagName('tbody')[0].innerHTML = html;
    document.getElementsByClassName('js-table-pagination-list')[0].innerHTML = table.getPagination();
}

function setJsDataTableSort(id, sortIndex) {
    let table = jsDataTables.filter(x => x.id == id)[0];

    if (table.sort[sortIndex] == undefined || table.sort[sortIndex] == 1) {
        table.sort[sortIndex] = 0;

        if (table.options.type == 'client') {
            table.options.data.sort((a, b) => {
                if (typeof(b[sortIndex]) == 'string') {
                    return a[sortIndex].localeCompare(b[sortIndex]);
                }
                return b[sortIndex] - a[sortIndex];
            });
        }
    } else {
        table.sort[sortIndex] = 1;

        if (table.options.type == 'client') {
            table.options.data.sort((a, b) => {
                if (typeof(b[sortIndex]) == 'string') {
                    return b[sortIndex].localeCompare(a[sortIndex]);
                }
                return a[sortIndex] - b[sortIndex];
            });
        }
    }

    for (let i = 0; i < table.options.columns.length; i++) {
        if (i != sortIndex) {
            table.sort[i] = null;
        }
    }

    let html = table.getDataToDisplay(table.search, table.page);
    
    document.getElementById('js-table-' + id).getElementsByTagName('thead')[0].innerHTML = table.getHeadersToDisplay();
    document.getElementById('js-table-' + id).getElementsByTagName('tbody')[0].innerHTML = html;
    document.getElementsByClassName('js-table-pagination-list')[0].innerHTML = table.getPagination();    
}

function setJsDataTablePreviousPage(pagingElement) {
    let id = pagingElement.getAttribute('js-table-id');
    let table = jsDataTables.filter(x => x.id == id)[0];

    if (table.page != 0) {
        table.page -= table.options.size;

        let html = table.getDataToDisplay(table.search, table.page);
    
        document.getElementById('js-table-' + id).getElementsByTagName('tbody')[0].innerHTML = html;
        document.getElementsByClassName('js-table-pagination-list')[0].innerHTML = table.getPagination();
    }
}

function setJsDataTableNextPage(pagingElement) {
    let id = pagingElement.getAttribute('js-table-id');
    let table = jsDataTables.filter(x => x.id == id)[0];

    if (table.page != (table.getAvailablePaginations() - 1) * table.options.size) {
        table.page += table.options.size;

        let html = table.getDataToDisplay(table.search, table.page);
    
        document.getElementById('js-table-' + id).getElementsByTagName('tbody')[0].innerHTML = html;
        document.getElementsByClassName('js-table-pagination-list')[0].innerHTML = table.getPagination();
    }
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
    let html = '';

    //Add 'select' tag to change size
    if (options.pagers) {
        html += jsDataTable.getPagersToDisplay();
    }

    //Add an 'input' tag for search
    html += '<input type="search" class="js-table-search form-control" placeholder="Search..." js-table-id="' + id + '" onchange="searchJsDataTable(this)" />';

    //Add a 'table' tag
    let cssTable = (options.css && options.css.table) ? (' ' + options.css.table) : '';
    html += '<table id="js-table-' + id + '" class="js-table table' + cssTable + '">';

    //Add headers
    if (options.columns) {
        html += '<thead class="js-table-thead"><tr class="js-table-header">';
        html += jsDataTable.getHeadersToDisplay();
        html += '</tr></thead>';
    }

    //Add rows
    html += jsDataTable.getDataToDisplay(undefined, 0);

    //End of 'table' tag
    html += '</table>'

    //Add pagination
    let pagination = '<nav class="js-table-pagination-list" js-table-id="' + id + '">' + jsDataTable.getPagination() + '</nav>';
    html += pagination;

    dt.innerHTML = html;

}