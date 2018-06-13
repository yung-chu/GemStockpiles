module.exports = {
    "env": {
        "browser": true
    },
    "extends": "airbnb",
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "vue/no-parsing-error": [
            2, 
            { 
                "x-invalid-end-tag": false
            }
        ]
    }
};