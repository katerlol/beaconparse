window.addEventListener('DOMContentLoaded', main, false);

function main() {
    var input = document.getElementById('file-input');
    input.addEventListener('change', readSingleFile, false);
}

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    var beacons = [];
    reader.onload = function(e) {
        var contents = e.target.result;
        var rows = contents.split('\r\n');
        var outputHmtl = "<table><tr><th>Bluuki Number</th><th>Mik Id</th></tr>";
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
            beacons[i].mikId = rowData[2].toString().substring(8) + pad(beacons[i].hexMinor, 4) + pad(beacons[i].hexMajor,4) ;

            if(beacons[i].mikId.length !== 32) {
                beacons[i].error = 'invalid mik id';
            }

            outputHmtl += "<tr><td>"+beacons[i].bluukiNumber+"</td><td>"+beacons[i].mikId+"</td><td>"+beacons[i].error+"</td></tr>";
        }

        outputHmtl += "</table>";
        document.getElementById("output").innerHTML = outputHmtl;
    };
    reader.readAsText(file);
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


