To support the Ivy engine in our library, and to make the demo site use Ivy we had to make a few
temporary changes to the site build steps. The Angular team currently recommends to distribute a
library without Ivy support, so that consumers can be both Ivy and non-Ivy projects.
The consumer then makes the library compatible by running ngcc over it (the ivy compatablility compiler).
To support that workflow, we now copy the material bundle distribution to our site/node_modules
directory, to accomplish that:
- ngcc picks it up
- ngcc doesn't overwrite stuff in the bundle
- ngcc has a build bundle to work on

This has the following drawbacks:
- We don't depend on the sources of the bundle anymore, but on a build package
- This means hot reloading of our library sources doesn't work if we are
  debugging the site.

Therefore all changes are marked with IVYSUPPORT, so that once these restrictions are gone, or once we
support Ivy from the bundle itself, we can drop these changes, and resume our previous build workflow.
