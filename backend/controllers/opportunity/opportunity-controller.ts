import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Opportunity } from "../../models/opportunity/opportunity-model";
import {
  parseItalianDateToUTC,
  calculateDateFromDay,
} from "../../config/dates";
import dataUtils from "../../utils/utils";
import { OpportunitySanitizer } from "../../utils/sanitizers/opportunitySanitizer";

// ----- UTILS ------------
const generic_utils = dataUtils();
// --------------- GET REQUESTS --------------------






const getAllOpportunities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pageSize = 10;
  const { full } = req.query;
  const userRole = req.user?.role
  if (full) {
    const opportunities = await Opportunity.find()
      .populate("user_id", "-password")
      .populate("contact_id");

      const sanitizedOpportunity = OpportunitySanitizer.sanitizeOpportunityList(opportunities as any[],userRole as string)

    res.status(200).json({ sanitizedOpportunity });
  } else {
    const query = req.query;
    const { page, search, filter, order, field } = query;
    const limit = pageSize || 10;
    const skip = (Number(page) - 1) * limit;
    try {
      if ((filter && search) || (order && field)) {
        let searchQuery = {};
        if (filter && search) {
          const key = generic_utils?.getFilter(filter as string);
          if (key) {
            searchQuery =
              key === "value"
                ? { [key]: Number(search) }
                : { [key]: { $regex: String(search), $options: "i" } };
          }
        }
        let sortOptions = {};
        if (order && field) {
          const sortKey = generic_utils.getFilter(field as string);
          const sortOrder = order === "ASC" ? 1 : order === "DESC" ? -1 : null;
          if (sortKey && sortOrder !== null) {
            sortOptions = { [sortKey]: sortOrder };
          }
        }

        // Verifico prima se la key avrà un numero e in quel caso preparo la query
        const opportunitiesFiltered = await Opportunity.find(searchQuery)
          .skip(skip)
          .sort(sortOptions)
          .limit(limit)
          .populate("user_id", "-password")
          .populate("contact_id");
        const totalLength =
          await Opportunity.find(searchQuery).countDocuments();

        const sanitizedOpportunities = OpportunitySanitizer.sanitizeOpportunityList(opportunitiesFiltered as any[],userRole as string)

        res.status(200).json({
          opportunities: sanitizedOpportunities,
          total: totalLength,
          page: page,
        });

        return;
      } else {
        const opportunities = await Opportunity.find()
          .skip(skip)
          .limit(limit)
          .populate("user_id", "-password")
          .populate("contact_id");
        const totalOpportunities = await Opportunity.find().countDocuments();
        if (opportunities?.length) {
        const sanitizedOpportunities = OpportunitySanitizer.sanitizeOpportunityList(opportunities as any[],userRole as string)

          res.status(200).json({ opportunities: sanitizedOpportunities, total: totalOpportunities });
        } else {
          res.status(404).json(`Opportunities list empty`);
        }
      }
    } catch (error) {
      res.status(500).json(`Internal server error`);
    }
  }
};

const getOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsId = req.params.id;
  const userRole = req.user?.role
  const opportunity = await Opportunity.findById(paramsId);
  try {
    if (opportunity) {
      const sanitizedOpportunity = OpportunitySanitizer.sanitizeOpportunityData(opportunity as any,userRole as string)
      

      res.status(200).json(sanitizedOpportunity);
    } else {
      res.status(404).json(`Opportuntiy not found`);
    }
  } catch (error) {
    res.status(500).json(`Internal server error`);
  }
};



// --------------- POST REQUESTS --------------------




const createOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next("errore");
  }
  const { name, value, stage, contact_id, user_id, activities } = req.body;
  try {
    const createdOpportunity = await Opportunity.create({
      name,
      value,
      stage,
      contact_id,
      user_id,
      activities,
    });

    res.status(201).json({
      user: createdOpportunity,
    });
  } catch (e) {
    res.status(500).json(e);
  }
};
//  --------------- PATCH REQUESTS --------------------
const modifyOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsId = req.params.id;
  const body = req.body;
  try {
    const opportunityToUpdate = await Opportunity.findByIdAndUpdate(
      paramsId,
      body,
      { new: true }
    );
    if (opportunityToUpdate) {
      await opportunityToUpdate?.save();
      res.status(200).json(opportunityToUpdate);
    } else {
      res.status(404).json(`User not found`);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsId = req.params.id;
  try {
    const opportunityToDelete = await Opportunity.findByIdAndDelete(paramsId);
    if (opportunityToDelete) {
      res.status(200).json(opportunityToDelete);
    } else {
      res.status(404).json(`Opportunity not found`);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// --------------- ACTIVITIES -----------------------------

const addActivityToOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const opportunityID = req.params.id;
  const activityToAdd = req.body;

  const { description, date, status } = activityToAdd;

  try {
    const opportunityToChange = await Opportunity.findById(opportunityID);
    if (!opportunityToChange) {
      res.status(404).json("not found");
      return;
    }

    if (description && date) {
      const dbReadyDate = parseItalianDateToUTC(date);

      opportunityToChange?.activities.push({
        description,
        date: dbReadyDate,
        status,
      });

      await opportunityToChange.save();
      res.status(201).json(opportunityToChange);
    } else {
      res.status(404).json(`Attività inserita non valida`);
    }
  } catch (error) {
    console.error("Errore nel salvataggio dell'attività:", error);
    res.status(500).json(error);
  }
};

const updateActivityFromOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsId = req.params.id;
  const activityToAdd = req.body;
  const activityId = req.headers.activityid;

  const { description, date, status } = activityToAdd;

  try {
    const opportunityToChange = await Opportunity.findById(paramsId);
    if (!opportunityToChange) {
      res.status(404).json("not found");
      return;
    }

    let activityToModify: any = opportunityToChange?.activities?.find(
      (activity) => {
        return String(activity._id) === activityId;
      }
    );

    opportunityToChange.activities.filter((activity) => {
      return String(activity._id) !== activityId;
    });

    if (activityToModify) {

      let dbReadyDate;
      if (!date.includes("/")) {
        dbReadyDate = activityToModify?.date;
      } else {
        dbReadyDate = parseItalianDateToUTC(date);
      }
      const newActivity = {
        _id: activityToModify._id,
        description: description ?? activityToModify.description,
        date: dbReadyDate,
        status: status ?? activityToModify.status,
      };
      let activityPosition =
        opportunityToChange.activities.indexOf(activityToModify);
      opportunityToChange.activities.splice(activityPosition, 1);
      opportunityToChange.activities.push(newActivity);
      await opportunityToChange.save();
      res.status(200).json({
        opportunityToChange,
        value: "Opportunità modificata con successo",
      });
    } else {
      res.status(404).json(`Attività inserita non valida`);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteActivityFromOpportunity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsId = req.params.id;
  const activityId = req.headers.activityid;

  try {
    const opportunityToChange = await Opportunity.findById(paramsId);
    if (!opportunityToChange) {
      res.status(404).json("not found");
      return;
    }
    if (activityId) {
      const newList = opportunityToChange?.activities.filter(
        (activity) => String(activity._id) !== activityId
      );
      opportunityToChange.activities = newList as any;
      await opportunityToChange.save();
      res.status(200).json(opportunityToChange);
    } else {
      res.status(404).json(`Id non trovato . impossibile rimuovere l'attività`);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getDashBoardKPI = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const today = new Date();

  const toRet: any = {
    totalOpportunities: [],
    opportunitiesOpen: [],
    opportunitiesWon: [],
    activitiesPlanned: [],
    latestOpportunities: [],
    activitiesCloseToEnd: [],
  };

  const totalOpportunities = await Opportunity.countDocuments();

  // opportunità aperte
  const opportunitiesOpen = await Opportunity.aggregate([
    {
      $match: { stage: { $in: ["nuova", "in corso"] } },
    },
    {
      $project: {
        activities: 0,
      },
    },
  ]);

  // Opportunita ultimi 30 giorni

  const last30Days = calculateDateFromDay(today, 30, "-");
  const opportunitiesWon = await Opportunity.find({
    stage: "vinta",
    createdAt: { $gte: last30Days, $lte: today },
  }).countDocuments();

  // attivita prossimi 7
  const from7Days = calculateDateFromDay(today, 7, "+");
  const activitiesPlanned = await Opportunity.find({
    "activities.date": { $gte: today, $lte: from7Days },
    "activities.status": "Pianificata",
  }).countDocuments();

  const latestOpportunities = await Opportunity.find()
    .sort({ createdAt: -1 })
    .limit(10);

  const activitiesCloseToEnd = await Opportunity.aggregate([
    {
      $unwind: "$activities",
    },
    {
      $sort: { "activities.date": 1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        name: 1,
        activities: 1,
        _id: 1,
      },
    },
  ]);

  toRet.totalOpportunities = totalOpportunities;
  toRet.opportunitiesWon = opportunitiesWon;
  toRet.opportunitiesOpen = opportunitiesOpen;
  toRet.activitiesPlanned = activitiesPlanned;
  toRet.activitiesCloseToEnd = activitiesCloseToEnd;
  toRet.latestOpportunities = latestOpportunities;

  res.status(200).json(toRet);
  return;
};

export const OpportunityController = {
  getOpportunity,
  getAllOpportunities,
  deleteOpportunity,
  modifyOpportunity,
  createOpportunity,
  // ACTIVITIES
  addActivityToOpportunity,
  updateActivityFromOpportunity,
  deleteActivityFromOpportunity,
  // DASHBOARD KPI
  getDashBoardKPI,
};
