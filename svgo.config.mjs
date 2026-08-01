export default {
    multipass: true,
    floatPrecision: 2,
    plugins: [
        {
            name: 'preset-default',
            params: { overrides: { cleanupIds: { minify: false } } }
        }
    ]
}
