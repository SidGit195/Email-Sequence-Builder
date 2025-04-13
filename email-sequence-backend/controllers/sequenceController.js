const Sequence = require('../models/Sequence');
const emailService = require('../services/emailService');

// Get all sequences for a user
exports.getSequences = async (req, res) => {
  try {
    const sequences = await Sequence.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(sequences);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific sequence
exports.getSequence = async (req, res) => {
  try {
    const sequence = await Sequence.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!sequence) {
      return res.status(404).json({ message: 'Sequence not found' });
    }

    res.json(sequence);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new sequence
exports.createSequence = async (req, res) => {
  try {
    const { name, flowData } = req.body;

    const newSequence = new Sequence({
      name,
      flowData,
      user: req.user.id
    });

    const sequence = await newSequence.save();
    
    // Schedule emails based on the flowchart (if not in serverless)
    if (process.env.VERCEL !== '1') {
      await scheduleEmailsFromFlow(flowData, req.app.locals.agenda);
    } else {
      console.log('Email scheduling bypassed in serverless environment');
    }
    
    res.status(201).json(sequence);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a sequence
exports.updateSequence = async (req, res) => {
  try {
    const { name, flowData } = req.body;

    // Check if sequence exists and belongs to user
    let sequence = await Sequence.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!sequence) {
      return res.status(404).json({ message: 'Sequence not found' });
    }

    // Update sequence
    sequence.name = name;
    sequence.flowData = flowData;
    sequence.updatedAt = Date.now();

    await sequence.save();
    
    // Schedule emails based on the updated flowchart (if not in serverless)
    if (process.env.VERCEL !== '1') {
      await scheduleEmailsFromFlow(flowData, req.app.locals.agenda);
    } else {
      console.log('Email scheduling bypassed in serverless environment');
    }
    
    res.json(sequence);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a sequence
exports.deleteSequence = async (req, res) => {
  try {
    // Check if sequence exists and belongs to user
    const sequence = await Sequence.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!sequence) {
      return res.status(404).json({ message: 'Sequence not found' });
    }

    res.json({ message: 'Sequence removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to schedule emails based on the flowchart
async function scheduleEmailsFromFlow(flowData, agenda) {
  const { nodes, edges } = flowData;
  
  // Find source nodes (typically lead source nodes)
  const sourceNodes = nodes.filter(node => {
    // Find nodes that have outgoing edges but no incoming edges
    return edges.some(edge => edge.source === node.id) && 
           !edges.some(edge => edge.target === node.id);
  });
  
  // For each source node, traverse the graph and schedule emails
  for (const sourceNode of sourceNodes) {
    await traverseAndSchedule(sourceNode.id, nodes, edges, agenda, 0);
  }
}

// Recursive function to traverse the graph and schedule emails
async function traverseAndSchedule(nodeId, nodes, edges, agenda, totalDelay) {
  const node = nodes.find(n => n.id === nodeId);
  
  if (!node) return;
  
  // If node is an email node, schedule it
  if (node.type === 'emailNode' && node.data.recipient) {
    await emailService.scheduleEmail(
      agenda,
      node.data.recipient,
      node.data.subject,
      node.data.body,
      totalDelay
    );
  }
  
  // If node is a delay node, add to the total delay
  if (node.type === 'delayNode') {
    let delayInMinutes = parseInt(node.data.delay) || 0;
    
    // Convert to minutes based on the unit
    if (node.data.unit === 'hours') {
      delayInMinutes *= 60;
    } else if (node.data.unit === 'days') {
      delayInMinutes *= 60 * 24;
    }
    
    totalDelay += delayInMinutes;
  }
  
  // Find outgoing edges from this node
  const outgoingEdges = edges.filter(edge => edge.source === nodeId);
  
  // Recursively traverse to the target nodes
  for (const edge of outgoingEdges) {
    await traverseAndSchedule(edge.target, nodes, edges, agenda, totalDelay);
  }
}