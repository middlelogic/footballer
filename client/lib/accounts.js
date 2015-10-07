Accounts.ui.config({
    dropdownClasses: 'simple',
    extraSignupFields: [
        {
            fieldName: 'first-name',
            fieldLabel: 'First name',
            inputType: 'text',
            visible: true,
            saveToProfile: true,
            validate: function(value, errorFunction) {
                if (value.trim() == '') {
                    errorFunction('First name cannot be blank');
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]
});
