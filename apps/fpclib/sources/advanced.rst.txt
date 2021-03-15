##############
Advanced Stuff
##############

This is an advanced tutorial on using fpclib to curate games/animations for Flashpoint.

It is recommended that you read :doc:`The Basics </basics>` before moving on to this tutorial.

.. contents:: Quick Links
   :local:

Multiple Curations
==================

The :func:`curate()` Function
-----------------------------

fpclib supports using the :func:`curate()` function to curate multiple games/animations from the same website. This function automatically creates :class:`Curation` objects with a list of urls and runs the :func:`Curation.save()` method on them. You can pass additional arguments to each curation through a dictionary.
::

    import fpclib

    urls = [('https://www.newgrounds.com/portal/view/218014', {'title': 'Interactive Buddy'}), ('https://www.newgrounds.com/portal/view/59593', {'title': 'Alien Hominid'})]
    fpclib.curate(urls, fpclib.Curation, True)

The :func:`curate()` function also offers the options to save curations in folders based on their titles instead of their ids, save progress in the case of a error, and ignore errors and return them at the end of the function. Click on the function to figure out more about the things you can do with it.

Parsing Websites for Metadata
-----------------------------

Manually typing in the metadata for every curation into each call to :func:`Curation.set_meta()` is tedious, and to deal with that, you can use the :func:`curate()` function and extend the :class:`Curation` class to parse the webpage at each source url.

Check out the code below, which takes full advantage of this fact::

    import fpclib
    import json
    import re

    class NewgroundsCuration(fpclib.Curation):
        def parse(self, soup):
            # Get Title
            self.set_meta(title=soup.find('div', id='embed_header').h2.text)
            # Get Launch Command
            text = str(soup) # The swf url is inside of json, so we have to search for it manually
            swf = json.loads(re.findall(r'embedController\\(\\[(.+),callback:', text)[0]+'}')['url']
            self.set_meta(cmd=fpclib.normalize(swf)) # Normalizes the url to make it use http.

    urls = ['https://www.newgrounds.com/portal/view/218014', 'https://www.newgrounds.com/portal/view/59593']
    fpclib.curate(urls, NewgroundsCuration, True)

This is possible because of the hidden method :func:`Curation.parse()`, which does nothing until you overwrite it. This method is called with a BeautifulSoup object created from the webpage's source url (see :func:`Curation.soupify()`). Through that one soup object it's possible to parse the entire webpage for metadata that changes between games/animations.

If you aren't familiar with using BeautifulSoup, you should read through the `BeautifulSoup documenation <https://www.crummy.com/software/BeautifulSoup/bs4/doc/>`_.

Overwriting Other Methods
^^^^^^^^^^^^^^^^^^^^^^^^^

You can also overwrite other :class:`Curation` class methods to change their functionality further. Take for example the :func:`Curation.get_files()` method::

    import fpclib
    import json
    import re

    class NewgroundsCuration(fpclib.Curation):
        def parse(self, soup):
            # Get Title
            self.set_meta(title=soup.find('div', id='embed_header').h2.text)
            # Get Launch Command
            text = str(soup) # The swf url is inside of json, so we have to search for it manually
            swf = json.loads(re.findall(r'embedController\\(\\[(.+),callback:', text)[0]+'}')['url']
            self.set_meta(cmd=fpclib.normalize(swf)) # Normalizes the url to make it use http.
        
        def get_files(self):
            super().get_files()
            fpclib.download('http://www.example.com') # Download the http://www.example.com/index.html file into the content folder.

    urls = ['https://www.newgrounds.com/portal/view/218014', 'https://www.newgrounds.com/portal/view/59593']
    fpclib.curate(urls, NewgroundsCuration, True)

Though this example isn't entirely useful, it does reveal a good point: if you don't want to completely overwrite a method and remove all of it's functionality, you'll have to use the :code:`super()` function to call the original method you are overwriting. You also need to provide it with the right arguments (ignoring the :code:`self` argument). Whether you put this at the beginning or end of the new function will determine if it gets run before or after your new code.

Curating from Multiple Websites
-------------------------------

If you want to curate from multiple websites, you'll want to use the :func:`curate_regex()` function instead of :func:`curate()`. This function works very similar to the :func:`curate()` function, but instead of passing a single :class:`Curation` sub-class into it, you pass in a list of tuples containing a regex and a :class:`Curation` sub-class. For more details, click on the function.

Further Reading
===============

That's the end of this tutorial. If you want something that goes into every function, class, and method in fpclib check out the :doc:`Globals </globals>` and :doc:`Classes </classes>` pages.