// Convenience class for creating data through functions instead of dictionaries.
class Group {
    // For legacy data
    rawdata(id, data) {
        this[id] = data;
        return this;
    }


    // Root field method
    field(id, name, type, desc="", link="", def=null, size=false) {
        this[id] = {
            name: name,
            type: type,
            desc: desc,
            link: link,
            default: def,
            size: size
        };
        return this;
    }


    // Info field (not really a field)
    info(text, id="iinfo", name="") {
        this[id] = {
            type: "info",
            info: text,
            name: name
        }
        return this;
    }


    // Text fields
    main(id, name, desc="", link="", def=null) {
        return this.field(id, name, "main", desc, link, def);
    }
    ns(id, name, desc="", link="", def=null) {
        return this.field(id, name, "ns", desc, link, def);
    }
    nsid(id, name, desc="", link="", def=null) {
        return this.field(id, name, "id", desc, link, def);
    }
    text(id, name, desc="", link="", def=null) {
        return this.field(id, name, "text", desc, link, def);
    }


    // Numeric fields
    int(id, name, desc="", link="", def=null) {
        return this.field(id, name, "int", desc, link, def);
    }
    double(id, name, desc="", link="", def=null) {
        return this.field(id, name, "double", desc, link, def);
    }


    // Boolean values
    checkbox(id, name, desc="", link="", def=null) {
        return this.field(id, name, "checkbox", desc, link, def);
    }
    bool(id, name, desc="", link="", def=null) {
        return this.field(id, name, "bool", desc, link, def);
    }


    // Image field
    image(id, name, desc="", link="", def=null) {
        return this.field(id, name, "image", desc, link, def);
    }


    // Multiline text fields
    ace(id, name, desc="", link="", def=null, size=false) {
        return this.field(id, name, "ace", desc, link, def, size);
    }
    textarea(id, name, desc="", link="", def=null, size=false) {
        return this.field(id, name, "textarea", desc, link, def, size);
    }
    textlist(id, name, desc="", link="", def=null, size=false) {
        return this.field(id, name, "textlist", desc, link, def, size);
    }


    // Options
    opts(id, name, desc="", link="", options, def) {
        this[id] = {
            name: name,
            type: "options",
            desc: desc,
            link: link,
            options: options,
            default: def
        };
        return this;
    }
    // Combines options with more
    moreopts() {

    }
    // Comparison (since it's used so often)
    comp(desc, name, double=false, toDesc, def=null) {
        this.opts(
            "comparison", "Comparison",
            desc, "https://origins.readthedocs.io/en/latest/data_types/comparison/#comparison",
            ["<", ">", ">=", "<=", "==", "!="]
        );

        if (double) {
            this.double("compare_to", name, toDesc, null, def);
        } else {
            this.int("compare_to", name, toDesc, null, def);
        }

        return this;
    }


    // Multitype field
    multi(id, name, desc="", link="", options, types, data, panel=false) {
        this[id] = {
            name: name,
            type: "multi",
            desc: desc,
            link: link,
            options: options,
            types: types,
            data: data,
            panel: panel
        }
        return this;
    }
    // Sub field
    sub(id, name, desc="", link="", data, type="sub") {
        this[id] = {
            name: name,
            type: type,
            desc: desc,
            link: link,
            data: data
        };
        return this;
    }


    // Lists
    nlist() {

    }
    list(id, name, desc="", link="", data) {
        return this.sub(id, name, desc, link, data, "list")
    }
};