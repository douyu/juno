package grpcinvoker

import (
	"bytes"
	"encoding/json"
	"text/template"
	"time"

	"github.com/jhump/protoreflect/desc"
)

// Call template data
type callTemplateData struct {
	FullyQualifiedName string // fully-qualified name of the method Call
	MethodName         string // shorter Call method name
	ServiceName        string // the service name
	InputName          string // name of the input message type
	OutputName         string // name of the output message type
	IsClientStreaming  bool   // whether this Call is client streaming
	IsServerStreaming  bool   // whether this Call is server streaming
	Timestamp          string // timestamp of the Call in RFC3339 format
	TimestampUnix      int64  // timestamp of the Call as unix time
}

// newCallTemplateData returns new Call template data
func newCallTemplateData(mtd *desc.MethodDescriptor) *callTemplateData {
	now := time.Now()

	return &callTemplateData{
		FullyQualifiedName: mtd.GetFullyQualifiedName(),
		MethodName:         mtd.GetName(),
		ServiceName:        mtd.GetService().GetName(),
		InputName:          mtd.GetInputType().GetName(),
		OutputName:         mtd.GetOutputType().GetName(),
		IsClientStreaming:  mtd.IsClientStreaming(),
		IsServerStreaming:  mtd.IsServerStreaming(),
		Timestamp:          now.Format(time.RFC3339),
		TimestampUnix:      now.Unix(),
	}
}

func (td *callTemplateData) execute(data string) (*bytes.Buffer, error) {
	t := template.Must(template.New("call_template_data").Parse(data))
	var tpl bytes.Buffer
	err := t.Execute(&tpl, td)
	return &tpl, err
}

func (td *callTemplateData) executeData(data string) ([]byte, error) {
	if len(data) > 0 {
		input := []byte(data)
		tpl, err := td.execute(data)
		if err == nil {
			input = tpl.Bytes()
		}

		return input, nil
	}

	return []byte{}, nil
}

func (td *callTemplateData) executeMetadata(metadata string) (*map[string]string, error) {
	var mdMap map[string]string

	if len(metadata) > 0 {
		input := []byte(metadata)
		tpl, err := td.execute(metadata)
		if err == nil {
			input = tpl.Bytes()
		}

		err = json.Unmarshal(input, &mdMap)
		if err != nil {
			return nil, err
		}
	}

	return &mdMap, nil
}
