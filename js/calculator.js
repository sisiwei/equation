
$(document).ready(function(){
    var calculatorTemplate = Handlebars.compile($('#calculatorTemplate').html()); 
    function standardize(equation){
        
        // Limit allowable characters
        // Allow alphanumeric, +, -, /, *, ., ()
        // No spaces
        equation = equation.replace(/[^a-zA-Z0-9._+\-*\/()]/g, '');

        // Add explicit multiplication operators
        // For parens, as in (a)(b) or 2(5+x)
        equation = equation.replace(/([A-Za-z0-9._)])\(/g, '$1*\(');
        equation = equation.replace(/\)([(A-Za-z0-9._])/g, '\)*$1');

        // And add them for cases like 2x (but not v4riable_name)
        
        equation = equation.replace(/(^|[^A-Za-z0-9._])([0-9.]+)([A-Za-z_])/g, '$1$2*$3');

        return equation;
    }
    function getVariables(equation){
        // Variables start with a letter and contain 
        // Letters, numbers and underscores
        var variables = equation.match(/[A-Za-z][A-Za-z0-9_]*/g);

        // Include each variable exactly once

        return _.uniq(variables);

    }
    function generate(){
        // Generate equation
        
        var equation = $('#equationInput').val();
        equation = standardize(equation);
        // Update the input
        $('#equationInput').val(equation);
        var variables = getVariables(equation);
        var round = $('#roundCheck').prop('checked');
        var roundPlaces;

        if (round)
        {
            roundPlaces = +($('#roundPlaces').val());
        }
            
        var calculatorSource = calculatorTemplate({
            variables: variables,
            equation: equation,
            round: round,
            roundPlaces : roundPlaces
        
        });

        // Can't otherwise close the nested script tag in the 
        // template
        calculatorSource += '    </script>';

        // Generate an example calculator

        try {
            if (variables.length == 0)
            {
                throw Error ();
            }
                
            $('#calculator-preview').html(calculatorSource);
            // And source to copy-paste
            $('#calculatorSource').val('\n        <!-- Delete the next line if you already have jQuery on your page: -->\n        <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>' + calculatorSource);
            $('.reveal').fadeIn(500);
            // $(window).animate({
            //     scrollTop: $('.try').position().top
            // },500, 'easeOutExpo');
            $('.error').fadeOut();
        }
        catch (e) {
            // Handle errors 
            // Since we don't check for unmatched parens, doubled-up
            // operators, etc.
            
            $('.error').fadeIn(100);
            setTimeout(function(){ $('.error').fadeOut(); }, 1500)
        }

    }
    $('#generateButton').click(generate);

});

