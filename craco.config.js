module.exports = {
    eslint: {
        enable: false
    },
    webpack: {
        configure: (webpackConfig) => ({
            ...webpackConfig,
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
            },
            module: {
                ...webpackConfig.module,
                rules: webpackConfig.module.rules.map((rule) => 
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
            }
        })
    }
}
