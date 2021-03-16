##########
The Basics
##########

This is a basic tutorial on using fpclib to curate games for Flashpoint.

If you've never coded in python before, you should check out the `official python tutorial <https://docs.python.org/3/tutorial/index.html>`_ page first.

This tutorial assumes that you already know the basics of curating for Flashpoint. If you do not know how to curate games/animations for Flashpoint, please follow the `Curation Tutorial <https://bluemaxima.org/flashpoint/datahub/Curation_Tutorial>`_ before using fpclib.

.. contents:: Quick Links
   :local:

Purpose
=======

As stated on the :doc:`Home </index>` page, there are numerous benefits of using fpclib to help you curate:

* By default, fpclib downloads main game/animation files and puts them in the right file format based upon your launch commands.
* Logos and screenshots can be automatically downloaded from online and converted to PNG files.
* Curating similar games/animations from one or more websites is simple and easy thanks to the :code:`fpclib.curate()` function.
* **Nearly every kind of Curation is possible to make with this library!** This library and documentation were created with the intent of making it easy to overwrite the Curation class to make it do different things. Anything you can do in the "Curate" tab in Flashpoint Core you can do with fpclib, except test games.

Ultimately, fpclib is not meant to replace other curating tools such as Flashpoint Core; it is meant to be used alongside of them. *Always* make sure any curation you make with fpclib is tested in Flashpoint Core before you submit it.

Usage
=====

You can install the library with
::

    pip install fpclib

or you can put the "fpclib.py" script (check the releases page on `github <https://github.com/xMGZx/fpclib>`_) in the same directory as your script.

If you choose the second option, you'll also need to install these libraries through pip::

    pip install requests
    pip install beautifulsoup4
    pip install pillow
    pip install ruamel.yaml

Once you have all of that set up, you can put :code:`import fpclib` at the top of your script to use it's methods.

Special Functions
=================

To help you with common curating tasks, fpclib comes packaged with several useful module-level functions. Here's a quick list of all of them; you can click on any of them for more details about what they do:

Internet
--------

.. autosummary::
   
   download
   download_all
   download_image
   normalize
   read_url
   get_soup
   get_fpdata

File IO
-------

.. autosummary::
   
   read
   read_lines
   read_table
   make_dir
   delete
   write
   write_line
   write_table
   hash256
   hash

Curating
--------

.. autosummary::
   
   test
   update
   debug
   clear_save
   curate
   curate_regex
   load

A Single Curation
=================

Before curating entire lists of games/animations with fpclib, it's important to understand how to use the library to curate a single game/animation by itself first. As shown on the :doc:`Home </index>` page, here's some very basic code you can use to curate a game::

    # Import fpclib curation
    from fpclib import Curation

    # Create a curation from a given url
    curation = Curation(url='https://www.newgrounds.com/portal/view/218014')
    # Set the logo of the curation
    curation.logo = 'https://picon.ngfiles.com/218000/flash_218014_medium.gif'
    
    # You can set metadata through the object directly or through the set_meta method
    curation.set_meta(title='Interactive Buddy', tags=['Simulation', 'Toy'])
    curation.set_meta(dev='Shock Value', pub='Wrong Publisher')
    curation.pub = 'Newgrounds'
    curation.ver = '1.01'
    curation.date = '2005-02-08'
    
    # Add an additional app
    curation.set_meta(cmd='http://uploads.ungrounded.net/218000/218014_DAbuddy_latest.swf')
    curation.add_app('Kongregate v1.02', 'http://chat.kongregate.com/gamez/0003/0303/live/ib2.swf?kongregate_game_version=1363985380')

    # Export this curation to the current working directory
    curation.save()

Here's what each step in this code does:

#. Import the library with :code:`import fpclib`
#. Create a new :class:`Curation` object. You don't have to set it's url immediately, but it should be set before you call :func:`Curation.save()`.
#. Set the url of the curation's logo. You can also set the screenshot with :attr:`Curation.ss`. Note that this will automatically be converted to a png file when the curation is saved. You do not need to set the logo or screenshot for every curation.
#. Set the curation's metadata using :func:`Curation.set_meta()` or directly through the object. You can put as many or little arguments into the function as you want. To see what arguments (or attributes) map to which parts of the curation's metadata, see :attr:`Curation.ARGS`. Note that descriptions and notes support multiple line strings (split lines with :code:`\\n`).
#. Add an additional app with :func:`Curation.add_app()`. You can also create extras, a message, or delete additional applications with other functions too (see the functions after :func:`Curation.add_app()`).
#. Finally, Save the curation to a folder with :func:`Curation.save()`. This accepts an argument named :code:`use_title` which if you set to True, will generate the curation folder with the curation's title instead of its id (see :attr:`Curation.id`).

You can find a full listing of every function in the :class:`Curation` class in the :doc:`Classes </classes>` page.

Editing Curations
=================

It's also possible to load and edit existing curations by using the :func:`fpclib.load()` function. Here's an example of that function in action::

    import fpclib
    
    c = fpclib.Curation(url='https://www.newgrounds.com/portal/view/218014', title='Interactive Buddy', cmd='http://uploads.ungrounded.net/218000/218014_DAbuddy_latest.swf')
    c.save(True)
    
    d = fpclib.load('Interactive Buddy')
    d.logo = 'https://picon.ngfiles.com/218000/flash_218014_medium.gif'
    d.add_app('Kongregate v1.02', 'http://chat.kongregate.com/gamez/0003/0303/live/ib2.swf?kongregate_game_version=1363985380')
    d.save(True, overwrite=True)

Note that if you want to mix new curations together with older curations with the same folder name, you have to set :code:`overwrite` to True.

Debugging
=========

As of version 1.3, fpclib supports printing debugging information about what it's doing. You'll normally see this when running :func:`fpclib.test()`, :func:`fpclib.curate()`, or :func:`fpclib.curate_regex()`. If you want to change what gets printed, modify the :data:`DEBUG_LEVEL` variable like so::

    fpclib.DEBUG_LEVEL = 2

This is by default set to 1, and only prints basic information from :func:`fpclib.test()`, :func:`fpclib.curate()`, and :func:`fpclib.curate_regex()`.

Further Reading
===============

If you fully understand how to make one curation at a time, you should move on to the :doc:`Advanced Stuff </advanced>` page to figure out how to curate in bulk.