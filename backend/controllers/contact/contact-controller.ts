// Contact controller datas
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Contact } from "../../models/contact/contact-model";
import dataUtils from "../../utils/utils";
// --------------- GET REQUESTS --------------------

const generic_utils = dataUtils();

const getContact = async (req: Request, res: Response, next: NextFunction) => {
  const paramsId = req.params.id;
  const contact = await Contact.findById(paramsId);
  try {
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json(`Contact not found`);
    }
  } catch (error) {
    res.status(500).json(`Internal server error`);
  }
};

const getAllContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let pageSize = 10;

  const { full } = req.query;
  if (full) {
    const contacts = await Contact.find().populate("user_id");

    try {
      if (contacts.length) {
        res.status(200).json({ contacts });
      } else {
        res.status(404).json(`No contact `);
      }
    } catch (error) {
      res.status(500).json(`Internal server error`);
    }
  } else {
    const query = req.query;
    const { page, search, filter, order, field } = query;
    const limit = pageSize || 10;
    const skip = (Number(page) - 1) * limit;
    try {
      if ((page && search) || (order && field)) {
        let searchQuery = {};
        if (filter && search) {
          const key = generic_utils?.getFilter(filter as string);
          if (key) {
            searchQuery = {
              [key]: { $regex: search, $options: "i" },
            };
          }
        }
        let sortOptions = {};
        if (order && field) {
          const sortKey = generic_utils?.getFilter(field as string);
          const sortOrder = order === "ASC" ? 1 : order === "DESC" ? -1 : null;
          if (sortKey && sortOrder !== null) {
            sortOptions = { [sortKey]: sortOrder };
          }
        }

        const contactsFiltered = await Contact.find(searchQuery)
          .populate("user_id")
          .sort(sortOptions)
          .skip(skip)
          .limit(limit);
        const results = await Contact.find(searchQuery).countDocuments();

        res.status(200).json({
          contacts: contactsFiltered,
          total: results,
          page: page,
        });
        return;
      } else {
        const contacts = await Contact.find().populate('user_id').skip(skip).limit(limit);
        const totalContacts = await Contact.find().countDocuments();
        if (contacts?.length) {
          res.status(200).json({ contacts, total: totalContacts });
        } else {
          res.status(404).json(`Contacts list empty`);
        }
      }
    } catch (error) {
      res.status(500).json(`Internal Server Error`);
    }
  }
};

const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next("errore");
  }
  const { name, email, phone, user_id } = req.body;
  try {
    const createdContact = await Contact.create({
      name,
      email,
      phone,
      user_id,
    });

    res.status(201).json({
      contact: createdContact,
    });
  } catch (e) {
    res.status(500).json(e);
  }
};
//  --------------- PATCH REQUESTS --------------------
const modifyContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsId = req.params.id;
  const body = req.body;

  try {
    const contactToUpdate = await Contact.findByIdAndUpdate(paramsId, body, {
      new: true,
    });
    if (contactToUpdate) {
      await contactToUpdate?.save();
      res.status(200).json(contactToUpdate);
    } else {
      res.status(404).json(`Contact not found`);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE REQUESTS
const deleteContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsId = req.params.id;
  try {
    const contactToDelete = await Contact.findByIdAndDelete(paramsId);
    if (contactToDelete) {
      res.status(200).json(contactToDelete);
    } else {
      res.status(404).json(`Contact not found`);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const ContactController = {
  getContact,
  getAllContacts,
  deleteContact,
  modifyContact,
  createContact,
};
