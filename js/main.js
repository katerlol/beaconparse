window.addEventListener('DOMContentLoaded', main, false);

function main() {
    var input = document.getElementById('file-input');
    input.addEventListener('change', readSingleFile, false);
    var sqlCreateButton = document.getElementById('sql-create-button');

    sqlCreateButton.addEventListener('click', () => {
        var accountName = document.getElementById('account-input');
        var sqlStatement ="<pre> INSERT INTO `device` \r\n(`accountID`,`deviceID`,`isActive`,`idtype`,`deviceFlag`,`creationTime`) VALUES \r\n";
        debugger;
        var sqlRows = [];
        for(var i = 0; i < beacons.length; i++) {
            if(beacons[i] !== undefined && true === beacons[i].sqlExport)
                sqlRows.push("('"+accountName.value+"', '"+beacons[i].mikId+"', 1, 1, 1, '"+Math.floor(new Date()/1000)+"')");
        }
        sqlStatement += sqlRows.join(',\r\n')+ "</pre>";

        if(sqlRows.length <= 0)
            sqlStatement = "Bitte wähle zumindest einen Beacon aus.";

        if(accountName.value.length <= 0) {
            sqlStatement = "Bitte gib einen Accountnamen an.";
        }

        document.getElementById('sql-output').innerHTML = sqlStatement;
    })
}

var beacons = [];

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        var rows = contents.split('\r\n');
        var outputHmtl = "<table><tr><th></th><th>Bluuki Number</th><th>Mik Id</th></tr>";
        for(var i = 1; i < rows.length; i++) {
            var rowData = rows[i].split(';');

            beacons[i] = {};
            beacons[i].error = "";

            if( undefined === rowData[2]) {
                beacons[i].error = 'row not parsable';
                continue;
            }

            beacons[i].uid =  rowData[2];
            beacons[i].bluukiNumber = rowData[1];
            beacons[i].minor = parseInt(rowData[3], 10);
            beacons[i].major = parseInt(rowData[4], 10);
            beacons[i].hexMinor = beacons[i].minor.toString(16);
            beacons[i].hexMajor = beacons[i].major.toString(16);
            beacons[i].mikId = rowData[2].toString().substring(8) + pad(beacons[i].hexMinor, 4) + pad(beacons[i].hexMajor,4);
            beacons[i].sqlExport = false;


            if(beacons[i].mikId.length !== 32) {
                beacons[i].error = 'invalid mik id';
            }

            outputHmtl += "<tr><td><input class='beacon-cbx' type='checkbox' data-beacon-row='"+i+"' id='cbx-"+i+"'></td><td>"+beacons[i].bluukiNumber+"</td><td>"+beacons[i].mikId+"</td><td>"+beacons[i].error+"</td></tr>";
        }


        outputHmtl += "</table>";
        document.getElementById("output").innerHTML = outputHmtl;

        var cbxes = document.getElementsByClassName('beacon-cbx');
        for(var i = 0; i < cbxes.length; i++) {
            var cbx = cbxes[i];
            cbx.addEventListener('change', (e) => {
                var cb = e.target;
                beacons[cb.dataset.beaconRow].sqlExport = cb.checked;
            });
        }
    };
    reader.readAsText(file);
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


