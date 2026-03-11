module.exports = {
    plugins: [
        require('react-strict-dom/postcss-plugin')({
            include: [
                'src/**/*.{js,jsx,mjs,ts,tsx}',
                'node_modules/pearpass-lib-uikit/*.js'
            ]
        }),
        require('autoprefixer')
    ]
};
