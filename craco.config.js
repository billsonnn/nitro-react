module.exports = {
    eslint: {
        enable: false
    },
    webpack: {
        configure: (webpackConfig) => ({
            ...webpackConfig,
            module: {
                ...webpackConfig.module,
                rules: [
                    ...webpackConfig.module.rules,
                    // {
                    //     test: /\.(png|jpg|gif)$/i,
                    //     use: [
                    //         {
                    //             loader: 'url-loader',
                    //             options: {
                    //                 limit: false,
                    //             },
                    //       } ,
                    //     ],
                    // }
                ].map(rule =>
                    {
                        if(!rule.oneOf) return rule;

                        return {
                            ...rule,
                            oneOf: rule.oneOf.map((ruleObject) => 
                            {
                                if(!new RegExp(ruleObject.test).test('.ts') || !ruleObject.include) return ruleObject;
                                
                                return { ...ruleObject, include: undefined };
                            })
                        };
                    })
            },
            optimization: {
                ...webpackConfig.optimization,
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                            name: 'vendors',
                            test: /[\\/]node_modules[\\/]/,
                            chunks: 'all',
                        },
                        renderer: {
                            name: 'renderer',
                            test: /[\\/]node_modules[\\/]@nitrots[\\/]nitro-renderer[\\/]/,
                            chunks: 'all',
                        }
                    }
                }
            }
        })
    }
}
