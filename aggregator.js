

var fs = require('fs')
, sys  = require('sys')
, _    = require('underscore');

fs.readFile(process.argv[2], 'utf-8', function(err, contents){
    
    var obj     = JSON.parse(contents)
    , agg   = {}
    , rows  = [];

    // aggregates the values by NOM_PARTE
    obj.rows.forEach(function(v){

         if(!agg[v.NOM_PARTE])
             agg[v.NOM_PARTE] = [];
         
         agg[v.NOM_PARTE].push(v);

    });

    _.keys(agg).forEach(function(v){
        
        var minimum = Number.MAX_VALUE;

        // gets the minimum value in the group
        agg[v].forEach(function(v){

            minimum = Math.min(minimum, v.COD_PARTE);

        });

        // applies the minimum to all rows in group
        agg[v].forEach(function(v){

            v.COD_PARTE_MATCH = minimum;

            rows.push(v);

        });


    });

    process.stdout.write(jsonToCSV(rows, true, null));

});

function jsonToCSV(dataSource, showHeader, fieldsToIgnore) {

    if(!_.isArray(dataSource)){
        return;
    }

    var rows = [];

    showHeader && rows.push(_.keys(dataSource[0]).join(', '));

    dataSource.forEach(function(currentRow){

        var row = [];

        _.keys(currentRow).forEach(function(key){

            if (_.isArray(fieldsToIgnore) && fieldsToIgnore.indexOf(key) >= 0) {
                return;
            }

            var value = currentRow[key];

            if (!_.isUndefined(value) && !_.isNull(value)) {

                if (_.isDate(value)) {

                    value = value.toISOString();
                
                } else if (_.isBoolean(value) || _.isNumber(value))    {

                    value = value.valueOf();

                } else    {

                    value = quote(value.valueOf());

                }

            }

            row.push(value);

        });

        rows.push(row.join(', '));

    });

    return rows.join("\r\n");

    function quote(value){
        return '"' + value.replace(/"/g, '""').replace(/\r/g, "\\r").replace(/\n/g, "\\b") + '"';
    };

};