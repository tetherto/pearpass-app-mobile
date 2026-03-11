module.exports = {
    plugins: [
        require('react-strict-dom/postcss-plugin')({
            include: [
                'src/**/*.{js,jsx,mjs,ts,tsx}',
                'node_modules/@tetherto/pearpass-lib-ui-kit/*.js'
            ]
        }),
        require('autoprefixer')
    ]
};
