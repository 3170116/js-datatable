function newJsDataTable(id, options) {

    //Find tag 'div' with id = 'id'
    let dt = document.getElementById(id);

    //Add a 'table' tag
    dt.innerText = '<table class="js-table">';

    //Add headers
    if (options.type == 'demo') {
        let headers = '<tr class="js-table-header"><th>First Name</th><th>Job</th><th class="js-table-number">Age</th></tr>'
        dt.innerText += headers;
    }

    //Add rows
    if (options.type == 'demo') {
        let row1 = '<tr class="js-table-row"><td>John</td><td>Math Teacher</td><td class="js-table-number">27</td></tr>';
        dt.innerText += row1;

        let row2 = '<tr class="js-table-row"><td>Alex</td><td>Softwear Engineer</td><td class="js-table-number">34</td></tr>';
        dt.innerText += row2;

        let row3 = '<tr class="js-table-row"><td>Matina</td><td>Chef</td><td class="js-table-number">42</td></tr>';
        dt.innerText += row3;
    }

    //End of 'table' tag
    dt.innerText += '</table>'
    dt.innerHTML = dt.innerText;

}