# About
Small set of utilities useful for debugging re-rendering and React app inefficiencies.

Most of the inefficiencies in React / Redux are caused by connecting components to way too often changing state even that they don't need that data, by giving them new object every time they get input, or by providing them with lambda methods in callbacks which are also new objects each time.

Just copy-paste the code into your React project.

# How to use

## TrackedComponent / TrackedPureComponent
Identify component(s) which re-render and shouldn't with React profiler or browser profiler.

Use the provided class instead of `React.Component` / `React.PureComponent` base class.

The base class listens to `componentDidUpdate`, and reports changes in props to the console.

NOTE: If you implement `componentDidUpdate`, you need to call super.componentDidUpdate in it.

Review how the reported properties are provided, and adjust them to provide the same instance every time if semantics of the data didn't change. This can be typically done one of these ways:
* Use constants for default values
* Narrow down the input to the necessary minimum (e.g. just one sub-property of the input)
* Memoize the input if more inputs are aggregated to a new object
* Use instance methods in parent component class instead of lambdas generated during their `render`
* Implement custom `shouldComponentUpdate`

Make sure that the component no longer reports changes to the props.

Replace the `Tracked` class back to the original class.

Run the profiler to validate the problem was fixed, continue with other components if needed.

## trackedMemoize
Identify costly code that seems to execute even when it should be memoized properly with React profiler (indirectly through component re-rendering) or through browser profiler.

Replace standard memoize with `trackedMemoize`.

The `trackedMemoize` observes the actual calls to the memoized method, and reports changes to parameters to the console.

Review how the parameters are provided, and adjust them to provide the same instance every time if semantics of the data didn't change. This can be typically done one of these ways:
* Use constants for default values
* Narrow down the input to the necessary minimum (e.g. just one sub-property of the input)
* Memoize the input if more inputs are aggregated to a new object

## Happy tracking!
