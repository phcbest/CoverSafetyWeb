module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    devServer: {
        proxy: {
            '/work': {
                target: 'http://119.3.40.236:23333',
                changeOrigin: true
            }
        }
    }
}
